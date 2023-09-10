import prisma from "../../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string }}) {
  try {
    const fieldsPromise = await prisma.grade.findFirst({
      where: {
       enrollment_id: Number(params.id),
      },
      select: {
        value: true,
        grade_id: true,
      }
    });

    return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

