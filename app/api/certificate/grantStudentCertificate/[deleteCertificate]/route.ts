
import { unlink, writeFile } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../../lib/prismadb";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function DELETE(
  request: Request,
  { params }: { params: { deleteCertificate: number} }
) {
  const supabase = createClientComponentClient();
  try {
    const file = await prisma.files.findUnique({
      where: {
        id: Number(params.deleteCertificate),
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    
    const { data, error } = await supabase
    .storage
    .from('files')
    .remove(['UsersCertificates/' + file.name])

    if(error) {
      throw error;
    }

    const deleteFile = await prisma.files.delete({
      where: {
        id: Number(params.deleteCertificate),
      },
    });

    if (!deleteFile) {
      return new NextResponse("Failed to delete file", { status: 500 });
    }
    // const filePath = file.path? path.join(process.cwd(), file.path, file.name) : '';
    // unlink(filePath, (err) => {
    //   if (err) throw err;
    //   console.log('path/file.txt was deleted');
    // });

    return new NextResponse("File deleted successfully", { status: 200 });
  } catch (error) {
    console.log(error)
    return new NextResponse("Database Error", { status: 500 });
  }
  
}
