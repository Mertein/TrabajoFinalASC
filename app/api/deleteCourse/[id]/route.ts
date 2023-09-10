import { unlink } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../lib/prismadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const deleteCourse = await prisma.course.delete({
      where: {
        course_id: Number(id),
      }
    })

    const file = await prisma.files.findUnique({
      where: {
        course_id: Number(id),
      },
    });

    if (!file) {
      const [fields] = await Promise.all([deleteCourse]);
      return NextResponse.json(fields);
    }

    const deleteFile = await prisma.files.delete({
      where: {
        course_id: Number(id),
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


    const [fields] = await Promise.all([deleteCourse]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}