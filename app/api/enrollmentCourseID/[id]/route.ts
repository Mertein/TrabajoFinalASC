import prisma from "../../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : any) {
  const {id} = params;
  try {
    const fieldsPromise = await prisma.enrollment_course.findFirst({
      where: {
        enrollment_id: Number(id),
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
        files: {
          where: {
            identifier: "studentCertificateCourse",
          }
        },
        course: {
          include: {
            category_course: true,
            branch_offices: true,
            usser: {
              select: {
                files: {
                  where: {
                    identifier: "userSignature",
                  }
                },
              first_name: true,
              last_name: true,
              },
            }
          }
        },
      },
    });

    const [fields] = await Promise.all([fieldsPromise]);
    return new NextResponse(JSON.stringify(fields), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

