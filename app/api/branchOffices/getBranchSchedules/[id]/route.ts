import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const fieldPromise = await prisma.schedules.findMany({
      where: {
        branch_id: Number(id),
      },
    })
    console.log(fieldPromise);
    const [fields] = await Promise.all([fieldPromise]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}