
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(request: Request) {
  const body = await request.json();
  try {
    const fieldsPromise = await prisma.course.findMany({
      where: {
        id_branch: body.id_branch,
        OR: [
          {
            AND: [
              { start_date: { lte: body.start_date } },
              { end_date: { gte: body.start_date } },
            ],
          },
          {
            AND: [
              { start_date: { lte: body.end_date } },
              { end_date: { gte: body.end_date } },
            ],
          },
          {
            AND: [
              { start_date: { gte: body.start_date } },
              { end_date: { lte: body.end_date } },
            ],
          },
        ],
      },
    }); 

    const overlapping = fieldsPromise.length > 0;

    return NextResponse.json(overlapping);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


