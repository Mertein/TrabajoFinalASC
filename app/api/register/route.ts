import bcrypt from 'bcrypt';
import prisma from "../../../lib/prismadb";

interface RequestBody {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  date_of_birth: string;
  address: string;
  phone_number: string;
  // emergency_contact: string;
  // gender: string;
  dni: string;
}

export async function POST(
  request: Request, 
) {
  const body: RequestBody = await request.json();
  
   const formattedDateOfBirth = new Date(body.date_of_birth);
   const hashedPassword = await bcrypt.hash(body.password, 12);
   const formatted_phone_number = parseInt(body.phone_number);
  //  const formatted_emergency_contact = parseInt(body.emergency_contact);
   const formatted_dni = parseInt(body.dni);
   const user = await prisma.usser.create({
    data: {
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        password: hashedPassword,
        date_of__birth: formattedDateOfBirth,
        address: body.address,
        // emergency_contact: formatted_emergency_contact,
        phone_number : formatted_phone_number,
        // gender: body.gender,
        dni: formatted_dni,
    }
  });
  const { password, ...result } = user;
  return new Response(JSON.stringify(result))
}