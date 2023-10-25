import { NextResponse } from "next/server";
import { unlink } from 'fs';
import path from "path";
import { writeFile } from "fs/promises";
import prisma from "../../../../lib/prismadb";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function POST(req: Request, { params }: { params: { courseid: number } }) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  if (!file) {
    return NextResponse.json({ success: false });
  }
  const supabase = createClientComponentClient()
  const uniqueIdentifier = Date.now();
  const fileName = `${uniqueIdentifier}_${file.name}`;
  const { error: uploadError } = await supabase.storage.from('files/Course').upload(fileName, file)

  if (uploadError) {
    throw uploadError
  }
  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);
  try {
    const fieldsPromise = await prisma.files.create({
      data: {
        path: "public/Course/",
        name: fileName,
        type: file.type,
        size: file.size,
        course_id: Number(params.courseid),
        format: 'file',
      }
   })
  //  if(fieldsPromise) {
  //   const filePath = path.join(process.cwd(), "public/Course", file.name);
  //   await writeFile(filePath, buffer);
  //   console.log(`open ${filePath} to see the uploaded file`);
  //  }
    const [fields] = await Promise.all([fieldsPromise]);
    return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    console.log(error);
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { courseid: number } }) {
  try {
    const file = await prisma.files.findFirst({
      where: {
        course_id: Number(params.courseid),
      }
   })
   
   if (!file) {
    return new NextResponse("File not found", { status: 404 });
  }

    const [fields] = await Promise.all([file]);
    return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    console.log(error);
    return new NextResponse("Database Error", { status: 500 });
  }
}


export async function PUT(req: Request, { params }: { params: { courseid: number } }) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  if (!file) {
    return NextResponse.json({ success: false });
  }
  const supabase = createClientComponentClient()
  const uniqueIdentifier = Date.now();
  const fileName = `${uniqueIdentifier}_${file.name}`;
  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);
  
  try {
    const fileUnique = await prisma.files.findUnique({
      where: {
        course_id: Number(params.courseid),
      },
    });

    if (!fileUnique) {
      return new NextResponse("File not found", { status: 404 });
    }

    const { data, error } = await supabase
    .storage
    .from('files')
    .remove(['Course/' + fileUnique.name])
  
    if(error) {
      throw error
    }

    // const filePath = fileUnique.path? path.join(process.cwd(), fileUnique.path) : '';
    // unlink(filePath, (err) => {
    //   if (err) throw err;
    //   console.log('path/file.txt was deleted');
    // });
    const { error: uploadError } = await supabase.storage.from('files/Course').upload(fileName, file)
  
    if (uploadError) {
      throw uploadError
    }
    // const filePath = file.path? path.join(process.cwd(), file.path) : '';
    // unlink(filePath, (err) => {
    //   if (err) throw err;
    //   console.log('path/file.txt was deleted');
    // });

    const result = await Promise.all([data, error]);

    const fieldsPromise = await prisma.files.update({
    where: {
      course_id: Number(params.courseid),
    },
    data: {
      path: "public/Course/",
      name: fileName,
      type:file.type,
      size: file.size,
      course_id: Number(params.courseid),
      format: 'file',
    }
  })
  const [fields] = await Promise.all([fieldsPromise]);
  return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    console.log(error);
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, fileid: string } }
) {
  const { id, fileid} = params;
  try {
    const file = await prisma.files.findUnique({
      where: {
        id: Number(fileid),
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    const deleteFile = await prisma.files.delete({
      where: {
        id: Number(fileid),
      },
    });

    if (!deleteFile) {
      return new NextResponse("Failed to delete file", { status: 500 });
    }

    const filePath = file.path? path.join(process.cwd(), file.path) : '';
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