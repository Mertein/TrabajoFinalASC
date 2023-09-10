import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const categories = await prisma.category_course.findMany();

  
    return new NextResponse(JSON.stringify(categories), {status: 200});
  } catch (error) {
    return new NextResponse("Database Error", {status: 500});
  }
}



export async function POST(request: Request) {

  const body = await request.json();
 
    try {
      const categories = await prisma.category_course.create({
        data: {
          category_name: body.category_name,
          file_category: body.imgUrl,
        },
      })
      return new NextResponse(JSON.stringify(categories), {status: 200});
    } catch (error) {
      return new NextResponse("Database Error", {status: 500});
    }
};


export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  const {data} = body;
  const {category_id, category_name, file_category} = data;
  try {
    const updateCategory = await prisma.category_course.update({
      where: {
        category_id,
      },
      data: {
        category_name,
        file_category,
      }
    })
    const [fields] = await Promise.all([updateCategory]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}