import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const promiseFields = await prisma.faqs.delete({
      where: {
        id: Number(id),
      }
    })
    const [fields] = await Promise.all([promiseFields]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(params)
  try {
    const promiseFields = await prisma.faqs.findFirst({
      where: {
        id: Number(id),
      }
    })
    const [fields] = await Promise.all([promiseFields]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}

