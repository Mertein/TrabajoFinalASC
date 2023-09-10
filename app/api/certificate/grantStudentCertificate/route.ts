import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import prisma from "../../../../lib/prismadb";

export async function POST(req: Request) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const id = data.get("enrollmentId") as unknown as number;
  console.log('FILE',file)
  console.log('ID',id)
  if (!file && !id) {
    return NextResponse.json({ success: false });
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);  
  try {
    const fieldsPromise = await prisma.files.create({
      data: {
        path: "public/Users/Certificates",
        name: file.name,
        type:file.type,
        size: file.size,
        enrollment_id: Number(id),
        identifier: 'studentCertificateCourse',
        format: 'file',
      }
   })
   if(fieldsPromise) {
    const filePath = path.join(process.cwd(), "public/Users/Certificates", file.name);
    await writeFile(filePath, buffer);
    console.log(`open ${filePath} to see the uploaded file`);
   }
    const [fields] = await Promise.all([fieldsPromise]);
    return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    console.log(error)
    return new NextResponse("Database Error", { status: 500 });
  }
}