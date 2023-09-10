import prisma from "../../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : any) {
  console.log(params);
  const {id} = params;
  try {
    const fieldsPromise = await prisma.enrollment_course.findMany({
      where: {
        course_id: Number(id),
      },
      select: {
        usser: true,
        user_id: true,
        completion_status: true,
        course_id: true,
        created_at: true, 
        deleted_at: true,
        updated_at: true,
        enrollment_date: true,
        enrollment_id: true,
        feedback_course: true,
        payment_status: true,
        grade: true,
      },
    });


    const [fields] = await Promise.all([fieldsPromise]);
    return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

  








