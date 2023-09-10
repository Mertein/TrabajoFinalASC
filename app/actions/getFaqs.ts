import prisma from "../../lib/prismadb";



const getCategories = async () => {
  try {
    const fieldsPromise = prisma.faqs.findMany();

    const [fields] = await Promise.all([fieldsPromise]);

    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getCategories;