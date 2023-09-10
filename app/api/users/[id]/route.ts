import { NextResponse } from "next/server";
import { differenceInYears } from "date-fns";
import prisma from "../../../../lib/prismadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const deleteUser = await prisma.usser.delete({
      where: {
        user_id: Number(id),
      }
    })
   
    return new Response(JSON.stringify(deleteUser))
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req: Request, {params} : any) {
  const {id} = params;
  try {
    const fieldsPromise = await prisma.usser.findFirst({
      where: {
        user_id: Number(id),
      },
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
    const usersWithRoles = fields ? [fields].map(user => ({
      ...user,
      roles: user.user_rol.map(userRol => userRol.rol.rol_name)
    })) : [];

    const usersWithoutUserRol = usersWithRoles.map(({ user_rol, ...user }) => user);

    const usersWithAge = usersWithoutUserRol.map(user => ({
      ...user,
      age: differenceInYears(new Date(), new Date(user.date_of__birth)),
    }));
    if (!usersWithAge.length) {
      return new NextResponse("User not found", {status: 404});
    }
    return NextResponse.json(usersWithAge );
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

