
import { NextResponse } from "next/server";
import prisma from "../../lib/prismadb";

type Class = {
  description_classs: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

const getCategories = async () => {
  try {
    const fieldsPromise = await prisma.files.findMany({
      where: {
        class_id: 1,
      },
    });
    return (fieldsPromise as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getCategories;