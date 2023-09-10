import { NextResponse } from "next/server";
import { unlink } from 'fs';
import path from "path";
import { writeFile } from "fs/promises";
import prisma from "../../../../lib/prismadb";


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; 

  try {
    const file = await prisma.files.findUnique({
      where: {
        id: Number(id), 
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(file), {status: 200});
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; 
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const identifier = data.get("title") as unknown as string;
  const enrollment_id = data.get("enrollment_id") as unknown as number;
  if (!file) {
    return NextResponse.json({ success: false });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  console.log(buffer);
  
  try {
    const fieldsPromise = await prisma.files.create({
      data: {
        path: "public/certificates/" + file.name,
        name: file.name,
        type:file.type,
        size: file.size,
        user_id: Number(id),
        identifier: identifier,
        format: 'file',
      }
   })
   if(fieldsPromise) {
    const filePath = path.join(process.cwd(), "public/certificates", file.name);
    await writeFile(filePath, buffer);
    console.log(`open ${filePath} to see the uploaded file`);
   }
   
   const enrollmentPromise = await prisma.enrollment_course.update({
    where: {
      enrollment_id: Number(enrollment_id),
    },
    data: {
      certificate: fieldsPromise.id,
    },
  })

    const [fields] = await Promise.all([fieldsPromise, enrollmentPromise]);
    return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}




export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; 

  try {
    const file = await prisma.files.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    const deleteFile = await prisma.files.delete({
      where: {
        id: Number(id),
      },
    });

    if (!deleteFile) {
      return new NextResponse("Failed to delete file", { status: 500 });
    }

    const filePath = file.path? path.join(process.cwd(), file.path, file.name) : '';
    unlink(filePath, (err) => {
      if (err) throw err;
      console.log('path/file.txt was deleted');
    });

    return new NextResponse("File deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error)
    return new NextResponse("Database Error", { status: 500 });
  }
}


