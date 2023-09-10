
import prisma from "../../lib/prismadb";

type Categories = {
  category_name: string;
  category_id: number;
  created_at: string;
  updated_at: string;
}

const getCategories = async (): Promise<Categories[]> => {
  try {
    const fieldsPromise = prisma.category_course.findMany();

    const [fields] = await Promise.all([fieldsPromise]);

    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getCategories;