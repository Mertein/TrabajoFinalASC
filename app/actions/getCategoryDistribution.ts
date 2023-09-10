import prisma from "../../lib/prismadb";

const getCategories = async () => {
  try {
    const fieldsPromise = await prisma.course.groupBy({
      by: ['category_id'],
      _count: {
        course_id: true,
      },
    });
  
    const categories = await prisma.category_course.findMany();
    const categoryDistribution = categories.map(category => {
    const count = fieldsPromise.find(item => item.category_id === category.category_id);
      return {
        category_name: category.category_name,
        count: count ? count._count.course_id : 0,
      };
    });

    return (categoryDistribution as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getCategories;