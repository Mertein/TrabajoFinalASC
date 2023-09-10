import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const deleteCategory = await prisma.category_course.delete({
      where: {
        category_id: Number(id),
      }
    })
    const [fields] = await Promise.all([deleteCategory]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}