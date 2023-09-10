import prisma from "../../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : any) {
  const {id} = params;
  try {
    const schedulePromise = await prisma.schedules.findMany({
      where: {
        branch_id: parseInt(id),
      },
    });

  
    return new NextResponse(JSON.stringify(schedulePromise), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

