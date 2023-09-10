import prisma from "../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {

  try {
    const courses = await prisma.course.findMany({
      select: {
        course_id: true,
        course_name: true,
        price_course: true,
        description_course: true,
        start_date: true,
        end_date: true,
        discount_percentage: true,
        start_date_discount: true,
        end_date_discount: true,
        isFree: true,
        description: true,
        user_id: true,
        apply_discount: true,
        category_id: true,
        id_branch: true,
        branch_offices: true,
        category_course: true,
        enrollment_course: true,
        files: {
          select: {
            id: true,
            path: true,
            name: true,
            type: true,
            size: true,
            format: true,
            course_id: true,
          }
        }
      }
    });
   
  
    return new NextResponse(JSON.stringify(courses), {status: 200});
  } catch (error) {
    return new NextResponse("Database Error", {status: 500});
  }
}

