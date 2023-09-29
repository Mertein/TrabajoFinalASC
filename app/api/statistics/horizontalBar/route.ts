// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

interface CourseData {
  course_name: string;
  popularity: number;
}

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  try {
    const whereCondition = {};

    if (startDate) {
      whereCondition.created_at = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      if (whereCondition.created_at) {
        whereCondition.created_at.lte = new Date(endDate);
      } else {
        whereCondition.created_at = {
          lte: new Date(endDate),
        };
      }
    }

    const enrollments = await prisma.enrollment_course.findMany({
      include: {
        course: true,
      },
      where: whereCondition,
    });
    const fieldsPromise = enrollments.reduce((accumulator: Record<string, CourseData>, enrollment) => {
      const key = enrollment.course.course_id.toString();

      if (!accumulator[key]) {
        accumulator[key] = {
          course_name: enrollment.course.course_name,
          popularity: 0,
        };
      }

      accumulator[key].popularity += 1;

      return accumulator;
    }, {});

    const coursePopularity = Object.values(fieldsPromise);
    // Ordenar los datos por popularidad en orden descendente
    coursePopularity.sort((a, b) => b.popularity - a.popularity);
    return new NextResponse(JSON.stringify(coursePopularity), { status: 200 });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
