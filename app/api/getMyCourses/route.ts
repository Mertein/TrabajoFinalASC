 import prisma from "../../../lib/prismadb";
import {getServerSession} from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;
  try {
    const coursesPromise = await prisma.course.findMany({
      where: {
        user_id: user_id as number | undefined,
      },
      select: {
        course_id: true,
        course_name: true,
        price_course: true,
        description_course: true,
        start_date: true,
        end_date: true,
        category_id: true,
        id_branch: true,
        user_id: true,
        branch_offices: {
          select: {
            branch_id: true,
            branch_name: true,
            people_capacity: true,
            branch_address: true,
          }
        },
        category_course: {
          select: {
            category_id: true,
            category_name: true
           
          }
        },
      }
    });
  
    return new NextResponse(JSON.stringify(coursesPromise), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

