import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const fieldsPromise = await prisma.faqs.findMany({
        select: {
            category: true,
            question : true,
            answer : true,
            id: true,
        },
    });
    return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
  } catch (error) {
    return new NextResponse("Database Error", {status: 500});
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {

    if(body.category === '') {
      const fieldsPromise = await prisma.faqs.create({
        data: {
            category: body.newCategory,
            question : body.question,
            answer : body.answer,
        }
    });
    return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
    } else {
      const fieldsPromise = await prisma.faqs.create({
        data: {
            category: body.category,
            question : body.question,
            answer : body.answer,
        }
    });
    return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
    }
  } catch (error) {
    return new NextResponse("Database Error", {status: 500});
  }
}


export async function PUT(request: Request) {
  const body = await request.json();
  try {
    if(body.category === '' || body.category === null) {
      const fieldsPromise = await prisma.faqs.update({
        where: {
          id: Number(body.id),    
        },
        data: {
            category: body.newCategory,
            question : body.question,
            answer : body.answer,
        }
      });
      const deleteUserInteractions = await prisma.user_interactions.deleteMany({
        where: {
          faq_id: Number(body.id),
        }
      });
      const fields = await Promise.all([fieldsPromise, deleteUserInteractions]);
      return new NextResponse(JSON.stringify(fields), {status: 200});
    } else {
      const fieldsPromise = await prisma.faqs.update({
        where: {
          id: Number(body.id),    
        },
        data: {
            category: body.category,
            question : body.question,
            answer : body.answer,
        }
      });
      const deleteUserInteractions = await prisma.user_interactions.deleteMany({
        where: {
          faq_id: Number(body.id),
        }
      });
      const fields = await Promise.all([fieldsPromise, deleteUserInteractions]);
      return new NextResponse(JSON.stringify(fields), {status: 200});
    }
  } catch (error) {
    return new NextResponse("Database Error", {status: 500});
  }
}



