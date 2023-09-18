import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { unlink } from "fs";
import bcrypt from 'bcrypt';
import prisma from "../../../../lib/prismadb";

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const id = data.get("id") as unknown as string;
    if (!file) {
      return NextResponse.json({ success: false });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
  
    try {

    const findFile = await prisma.files.findFirst({
        where: {
            user_id: Number(id),
            identifier: 'userPicture'
        }
    })

    if(findFile) {
      await prisma.files.delete({
          where: {
              id: findFile.id
          }
      })

      const filePath = findFile.path? path.join(process.cwd(), findFile.path, findFile.name) : '';
      unlink(filePath, (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
      });
    }

     const filesPromise = await prisma.files.create({
        data: {
          path: "public/Users/ProfilePicture",
          name: file.name,
          type: file.type,
          size: file.size,
          format: 'file',
          user_id: Number(id),
          identifier: 'userPicture'
        }
     })
     if(filesPromise) {
      const filePath = path.join(process.cwd(), "public/Users/ProfilePicture", file.name);
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
  const {values} = body;
  const {first_name, last_name, email, date_of__birth, emergency_contact, phone_number, dni,  gender, address, user_id, password} = values;
  const formattedDateOfBirth = new Date(date_of__birth);
  const formatted_phone_number = parseInt(phone_number);
  const formatted_emergency_contact = parseInt(emergency_contact);
  const formatted_dni = parseInt(dni);
  const hashedPassword = await bcrypt.hash(password, 12);
  try {

  if(password === '') {
    const updateUser = await prisma.usser.update({
        where: {
          user_id: user_id,
        },
        data: {
          first_name: values.first_name,
          last_name: values.last_name,
          email: email,
          date_of__birth: formattedDateOfBirth,
          address: address,
          emergency_contact: formatted_emergency_contact,
          phone_number : formatted_phone_number,
          // gender: gender,
          dni: formatted_dni,
          updated_at: new Date()
      }
      })
    return NextResponse.json(updateUser);
  } else {
    const updateUser = await prisma.usser.update({
        where: {
          user_id: user_id,
        },
        data: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          date_of__birth: formattedDateOfBirth,
          address: address,
          emergency_contact: formatted_emergency_contact,
          phone_number : formatted_phone_number,
          // gender: gender,
          dni: formatted_dni,
          password: hashedPassword ,
          updated_at: new Date()
      }
      })
      const { password, ...result } = updateUser;
      return new Response(JSON.stringify(result))
  }
  } catch (error) {
    console.error(error);
    throw error;
  }
}