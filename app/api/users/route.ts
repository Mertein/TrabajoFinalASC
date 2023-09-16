import { NextResponse } from "next/server";
import { differenceInYears } from "date-fns";
import bcrypt from 'bcrypt';
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const fieldsPromise = prisma.usser.findMany({
      select: {
        first_name: true,
        last_name: true,
        email: true,
        user_id: true,
        gender: true,
        dni: true,
        phone_number: true,
        address: true,
        date_of__birth: true,
        emergency_contact: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        user_rol: {
          select: {
            rol: {
              select: {
                rol_name: true
              }
            }
          }
        }
      },
    });
    
    
    

    const [fields] = await Promise.all([fieldsPromise]);
    const usersWithRoles = fields.map(user => ({
      ...user,
      roles: user.user_rol.map(userRol => userRol.rol.rol_name)
    }));

    const usersWithoutUserRol = usersWithRoles.map(({ user_rol, ...user }) => user);

    const usersWithAge = usersWithoutUserRol.map(user => ({
      ...user,
      age: differenceInYears(new Date(), new Date(user.date_of__birth)),
    }));
    
    return NextResponse.json(usersWithAge );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(
  request: Request, 
) {
  const body = await request.json();
    
  const {first_name, last_name, password, email, date_of__birth, emergency_contact, phone_number, dni, address} = body.user;
  const rolesLength = body.user.roles[0].length;
   const formattedDateOfBirth = new Date(date_of__birth);
   const hashedPassword = await bcrypt.hash(password, 12);
   const formatted_phone_number = parseInt(phone_number);
   const formatted_emergency_contact = parseInt(emergency_contact);
   const formatted_dni = parseInt(dni);
   const user = await prisma.usser.create({
    data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashedPassword,
        date_of__birth: formattedDateOfBirth,
        address: address,
        emergency_contact: formatted_emergency_contact,
        phone_number : formatted_phone_number,
        gender: 'Nan',
        dni: formatted_dni,
    }
  });

  for(let i = 0; i < rolesLength; i++){
    const userRol = await prisma.user_rol.create({
      data: {
        user_id: user.user_id,
        rol_id: body.user.roles[0][i] === 'Student' ? 1 : body.user.roles[0][i] === 'Instructor' ? 2 : 3,
      }
  })
  }
  return new Response(JSON.stringify(user))
}

export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  const {data} = body;
  const {user} = data;
  const {rolesLength} = data;
  const {rolesID} = data;
  const {first_name, last_name, email, date_of__birth, emergency_contact, phone_number, dni, address, user_id, roles} = user;
   
   const formattedDateOfBirth = new Date(date_of__birth);
   const formatted_phone_number = parseInt(phone_number);
   const formatted_emergency_contact = parseInt(emergency_contact);
   const formatted_dni = parseInt(dni);
    try {
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
          gender: 'Nan',
          dni: formatted_dni,
      }
      })
      
      
      const deleteUserRoles = await prisma.user_rol.deleteMany({
        where: {
          user_id: user_id,
        }
      })
      
      
     
     
      for(let i = 0; i < rolesLength; i++){
        const userRol = await prisma.user_rol.create({
          
          data: {
            user_id: user_id,
            rol_id: Number(rolesID[i]),
          }
      })
    }
  
     
      return NextResponse.json(updateUser);

    } catch (error) {
      console.error(error);
      throw error;
    }
}