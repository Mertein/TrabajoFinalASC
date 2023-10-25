import { writeFile } from "fs/promises";
import prisma from "../../../lib/prismadb";
import { NextResponse } from "next/server";
import path from "path";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function GET(req: Request, res: Response) {
  try {
    const body = await req.json();
    console.log(body);
    const courseId = 1; // ID del curso para el cual deseas obtener las clases y archivos

  const classes = await prisma.class_course.findMany({
    where: {
      course_id: courseId,
    },
    orderBy: {
      class_id: "asc",
    },
  });

  console.log('holasdsd')
  const classesWithFiles = await Promise.all(
    classes.map(async (clase) => {
      const files = await prisma.files.findMany({
        where: {
          class_id: clase.class_id,
        },
      });

      return {
        ...clase,
        files: files,
      };
    })
  );

    // console.log(classesWithFiles);
    return new NextResponse(JSON.stringify(classesWithFiles), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

export async function POST(req: Request, res: Response) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const class_id = data.get("class_id") as unknown as number;
  const title = data.get("title") as unknown as string;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const supabase = createClientComponentClient()
  const uniqueIdentifier = Date.now();
  const fileName = `${uniqueIdentifier}_${file.name}`;
  const { error: uploadError } = await supabase.storage.from('files/ClassesCourse').upload(fileName, file)

  if (uploadError) {
    throw uploadError
  }

  try {
    // const filePath = path.join(process.cwd(), "public/ClassesCourse", file.name);
    // await writeFile(filePath, buffer);
    // console.log(`open ${filePath} to see the uploaded file`);

    const filesPromise = await prisma.files.create({
        data: {
          path: "public/ClassesCourse/" + fileName,
          name: fileName,
          type:file.type,
          size: file.size,
          class_id: Number(class_id),
          format: 'file',
          title: title,
        }
    })
      return new NextResponse(JSON.stringify(filesPromise), {status: 200});
    } catch (error) {
      console.error(error);
      return new NextResponse("Database Error", {status: 500});
    }
}

export async function PUT(req: Request, res: Response) {
  const body = await req.json();

  if(body.description_class !== '' && body.description_class) {
    try {
      const fieldsPromise = await prisma.class_course.update({
        where: {
          class_id: body.classId,
        },
        data: {
          description_class: body.description_class,
        },
      });
      return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
    } catch (error) {
      console.error(error);
      return new NextResponse("Database Error", {status: 500});
    }
  }

  if(body.title !== '' && body.title) {
    try {
      const fieldsPromise = await prisma.files.update({
        where: {
          id: body.fileId,
        },
        data: {
          title: body.title,
        },
      });
      return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
    } catch (error) {
      console.error(error);
      return new NextResponse("Database Error", {status: 500});
    }
  }

  if(body.isVirtual !== '') {
    try {
      const fieldsPromise = await prisma.class_course.update({
        where: {
          class_id: body.class_id,
        },
        data: {
          isVirtual: body.isVirtual,
        },
      });
      return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
    } catch (error) {
      console.error(error);
      return new NextResponse("Database Error", {status: 500});
    }
  }
  return new NextResponse("Error", {status: 500});
}