import { unlink} from "fs";
import { NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../lib/prismadb";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; 
  console.log(id)
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