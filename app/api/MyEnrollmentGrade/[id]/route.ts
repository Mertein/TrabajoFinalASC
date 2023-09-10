import {getServerSession} from 'next-auth';
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string }}) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;
  try {
    const enrollment = await prisma.enrollment_course.findFirst({
      where: {
        user_id: user_id,
        course_id: Number(params.id),
      },
      select: {
        grade: true,
      },
    });

    if (enrollment) {
      const { grade } = enrollment;
      const gradeArray = grade[grade.length - 1];
      return NextResponse.json(gradeArray);
    } else {
      return NextResponse.json(null); // Or handle the case when enrollment is not found
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}




