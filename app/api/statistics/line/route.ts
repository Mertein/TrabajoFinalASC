// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(req: Request, res: Response) {
  try {
    const enrollments = await prisma.enrollment_course.findMany();

    const fieldsPromise = enrollments.reduce((accumulator, enrollment) => {
      const month = enrollment.created_at.getMonth() + 1; // Months are zero-based
      const year = enrollment.created_at.getFullYear();
      const key = `${year}-${month}`;

      if (!accumulator[key]) {
        accumulator[key] = {
          date: new Date(year, month - 1), // Month is zero-based
          count: 0,
        };
      }
      accumulator[key].count++;

      return accumulator;
    }, {});

    const enrollmentTrend = Object.values(fieldsPromise);

    return new NextResponse(JSON.stringify(enrollmentTrend), {status: 200});
  } catch (error) {
    return new NextResponse("Database Error", {status: 500});
  }
};
