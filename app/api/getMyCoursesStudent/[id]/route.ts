import prisma from "../../../../lib/prismadb";
import {getServerSession} from 'next-auth';
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : any) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;
  const {id} = params;
  try {
    const fieldsPromise = await prisma.enrollment_course.findFirst({
      where: {
        course_id: Number(id),
        user_id: Number(user_id),
      },
    });

    const [fields] = await Promise.all([fieldsPromise]);
    return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

  








