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
        password: true,
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
    console.log(body)
    const {first_name, last_name, password, email, date_of_birth, emergency_contact, phone_number, dni, gender, address} = body.user;
   const formattedDateOfBirth = new Date(date_of_birth);
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
        gender: gender,
        dni: formatted_dni,
    }
  });
  console.log('user',user)
  return new Response(JSON.stringify(user))
}
// export async function POST(request: Request) {

//   const body = await request.json();
//   console.log(body)
  
  
//     const branchOffices = await prisma.branch_offices.create({
//       data: {
//         branch_name: body.branch_name,
//         branch_address: body.branch_address,
//         people_capacity: body.people_capacity,
//       },
//     })
//     return new NextResponse(JSON.stringify(branchOffices), {status: 200});

// };




// export async function PUT(req: Request, res: Response) {
//   const body = await req.json();
//   const {data} = body;
//   const {branch_id, branch_name, branch_address, people_capacity} = data;
//   try {
//     const updateBranch = await prisma.branch_offices.update({
//       where: {
//         branch_id,
//       },
//       data: {
//         branch_name,
//         branch_address,
//         people_capacity,
//       }
//     })
//     const [fields] = await Promise.all([updateBranch]);
//     return NextResponse.json(fields);
//   } catch (error) {
//     console.log(error);
//   }
// }