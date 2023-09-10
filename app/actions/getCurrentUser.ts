import { getServerSession } from "next-auth/next"

import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from '../../lib/prismadb'
import { differenceInYears, parse } from "date-fns";
import { Identifier } from "@prisma/client";

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.usser.findUnique({
      where: {
        email: session.user.email as string,
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
        user_rol: {
          select: {
            rol: {
              select: {
                rol_name: true
              }
            }
          }
        },
        files: {
          where:{
            user_id: session?.user.user_id,
            identifier: 'userPicture',
          },
          select: {
            name: true,
            identifier: true,
            type: true,
          }
        },
      },
    });

    const [fields] = await Promise.all([currentUser]);

    if (!currentUser) {
      return null;
    }

    const usersWithRoles = fields ? [fields].map(user => ({
      ...user,
      roles: user.user_rol.map(userRol => userRol.rol.rol_name)
    })) : [];

    const usersWithoutUserRol = usersWithRoles.map(({ user_rol, ...user }) => user);

    const usersWithAge = usersWithoutUserRol.map(user => ({
      ...user,
      date_of__birth: user.date_of__birth.toISOString(), // Formatea directamente la fecha en ISO 8601
      age: differenceInYears(new Date(), new Date(user.date_of__birth)),
      dni: Number(user.dni), // Convertir el valor decimal a número
      phone_number: Number(user.phone_number), // Convertir el valor decimal a número
      emergency_contact: Number(user.emergency_contact), // Convertir el valor decimal a número
    }));
    return usersWithAge[0];
  } catch (error: any) {
    return null;
  }
}
