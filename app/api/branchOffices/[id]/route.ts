import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const deleteBranch = await prisma.branch_offices.delete({
      where: {
        branch_id: Number(id),
      }
    })
    const [fields] = await Promise.all([deleteBranch]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
  
}