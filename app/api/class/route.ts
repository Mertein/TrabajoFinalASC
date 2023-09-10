import { writeFile } from "fs/promises";
import prisma from "../../../lib/prismadb";
import { NextResponse } from "next/server";
import path from "path";

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
  console.log(class_id)
  console.log(file);

  

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  console.log(buffer);
    

    try {
      const filesPromise = await prisma.files.create({
         data: {
           path: "public/ClassesCourse/" + file.name,
           name: file.name,
           type:file.type,
           size: file.size,
           class_id: Number(class_id),
           format: 'file',
           title: title,
         }
      })
      if(filesPromise) {
        const filePath = path.join(process.cwd(), "public/ClassesCourse", file.name);
        await writeFile(filePath, buffer);
        console.log(`open ${filePath} to see the uploaded file`);
       }
        return new NextResponse(JSON.stringify(filesPromise), {status: 200});
      } catch (error) {
        console.error(error);
        return new NextResponse("Database Error", {status: 500});
      }

}

export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  console.log(body);

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
      console.log(fieldsPromise);
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
      console.log(fieldsPromise);
      return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
    } catch (error) {
      console.error(error);
      return new NextResponse("Database Error", {status: 500});
    }
  }

  if(body.isVirtual !== '') {
    console.log('entre a IsVirtual')
    try {
      const fieldsPromise = await prisma.class_course.update({
        where: {
          class_id: body.class_id,
        },
        data: {
          isVirtual: body.isVirtual,
        },
      });
      console.log(fieldsPromise);
      return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
    } catch (error) {
      console.error(error);
      return new NextResponse("Database Error", {status: 500});
    }
  }
  return new NextResponse("Error", {status: 500});
}