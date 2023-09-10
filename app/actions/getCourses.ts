import prisma from "../../lib/prismadb";

const getCourses = async () => {
  try {
    const fieldsPromise = await prisma.class_course.findMany({
      include: {
        schedules: true,
      },
    });
      const [fields] = await Promise.all([fieldsPromise]);
      return (fields as any) || [];
    } catch (error) {
      console.error(error);
      throw error;
    }
}
export default getCourses;