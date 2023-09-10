import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const fieldsPromise = prisma.grade.findMany({
      select: {
        grade_id: true,
        enrollment_course: true,
        enrollment_id: true,
        value: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      }
      
    }); 
    
    const [fields] = await Promise.all([fieldsPromise]);
    return NextResponse.json(fields);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(request: Request) {

  const body = await request.json();
  console.log(body)
  
  
    const grade = await prisma.grade.create({
      data: {
        enrollment_id: body.enrollment_id,
        value: body.grade,
      },
    })
    return new NextResponse(JSON.stringify(grade), {status: 200});

};


export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  try {
    const fieldsPromise = await prisma.grade.update({
      where: {
        grade_id: body.grade_id,
      },
      data: {
        value: body.value,
        updated_at: new Date(),
      }
    })
    const [fields] = await Promise.all([fieldsPromise]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}