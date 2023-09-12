import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const fieldsPromise = await prisma.updateTime.findFirst({
      where : { id : 1 },
    });

    const fields = await Promise.all([fieldsPromise]);
    console.log(fields);

    return new NextResponse(JSON.stringify(fields), { status: 200 });
    
  } catch (error) {
    console.log(error)
  }
}

export async function PUT(request: Request) {
  try {
    const fieldsPromise = await prisma.updateTime.update({
      where : { id : 1 },
      data : { updated_at : new Date() }
    });

    const fields = await Promise.all([fieldsPromise]);
    console.log(fields);

    return new NextResponse(JSON.stringify(fields), { status: 200 });
    
  } catch (error) {
    console.log(error)
    return new NextResponse("Database Error", { status: 500 });
  }
}
