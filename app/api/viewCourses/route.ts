import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(req: Request, res: Response) {
const coursesPromise = await prisma.course.findMany({
  include: {
    category_course: {
      
    },
    branch_offices: {
     
    }
  }
});
  const [courses] = await Promise.all([coursesPromise]);
  return NextResponse.json(courses);
}

