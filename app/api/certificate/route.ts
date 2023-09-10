import { NextRequest, NextResponse } from "next/server";
import path from "path";
import prisma from "../../../lib/prismadb";
import { writeFile } from "fs/promises";

export async function GET(request: Request) {
  try {
    const certificates = await prisma.files.findMany();
    return new NextResponse(JSON.stringify(certificates), { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }
  
  console.log(file)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
   const filesPromise = await prisma.files.create({
      data: {
        path: "public/certificates/" + file.name,
        name: file.name,
        type: file.type,
        size: file.size,
        format: 'file',
      }
   })

   if(filesPromise) {
    const filePath = path.join(process.cwd(), "public/certificates", file.name);
    await writeFile(filePath, buffer);
    console.log(`open ${filePath} to see the uploaded file`);
   }
    return new NextResponse(JSON.stringify(filesPromise), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}