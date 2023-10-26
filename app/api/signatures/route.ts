import { writeFile } from "fs/promises";
import prisma from "../../../lib/prismadb";
import { NextResponse } from "next/server";
import path from "path";
import {getServerSession} from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";
import { unlink } from "fs";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;
  try {

  const fieldsPromise = await prisma.files.findFirst({
    where: {
      user_id: Number(user_id),
      identifier: 'userSignature',
    },
  });
    return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

export async function POST(req: Request, res: Response) {
  const supabase = createClientComponentClient();
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const id = data.get("id") as unknown as number;
  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);
    try {

      const { data, error } = await supabase.storage
      .from('files/UsersSignatures')
      .upload(file.name, file);

      // Handle error if upload failed
      if(error) {
        throw error;
      }

      const filesPromise = await prisma.files.create({
         data: {
           path: "public/Users/Signatures/",
           name: file.name,
           type:file.type,
           size: file.size,
           user_id: Number(id),
           format: 'file',
           identifier: 'userSignature',
         }
      })
      // if(filesPromise) {
      //   const filePath = path.join(process.cwd(), "public/Users/Signatures", file.name);
      //   await writeFile(filePath, buffer);
      //   console.log(`open ${filePath} to see the uploaded file`);
      //  }
        return new NextResponse(JSON.stringify(filesPromise), {status: 200});
      } catch (error) {
        console.error(error);
        return new NextResponse("Database Error", {status: 500});
      }
}

export async function PUT(req: Request, res: Response) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  const id = data.get("id") as unknown as number;
  const file_id = data.get("file_id") as unknown as number;
  const filePathOld = data.get("filePathOld") as unknown as string;
  const fileNameOld = data.get("fileNameOld") as unknown as string;
  const supabase = createClientComponentClient();
  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);
  try {
    const fileUnique = await prisma.files.findUnique({
      where: {
        id: Number(file_id),
      },
    });

    if (!fileUnique) {
      return new NextResponse("File not found", { status: 404 });
    }

    const { data, error } = await supabase
    .storage
    .from('files')
    .remove(['UsersSignature/' + fileUnique.name])

    if(error) {
      throw error;
    }

    const { data: dataUpload, error: errorUpload } = await supabase.storage
      .from('files/UsersSignature')
      .upload(file.name, file);

      // Handle error if upload failed
      if(error) {
        throw error;
      }

    const filesPromise = await prisma.files.update({
      where: {
        id: Number(file_id),
      },
       data: {
         path: "public/Users/Signatures/",
         name: file.name,
         type:file.type,
         size: file.size,
         user_id: Number(id),
         format: 'file',
         identifier: 'userSignature',
       }
    })
      return new NextResponse(JSON.stringify(filesPromise), {status: 200});
    } catch (error) {
      console.error(error);
      return new NextResponse("Database Error", {status: 500});
    }

  
}

