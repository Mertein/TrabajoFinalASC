
import prisma from "../../lib/prismadb";


const getStudentEnrollment = async (id: number) => {
  try {
    const fieldsPromise = await prisma.enrollment_course.findMany({
      where: {
        course_id: Number(id),
      },
      select: {
        usser: true,
        user_id: true,
        completion_status: true,
        course_id: true,
        created_at: true, 
        deleted_at: true,
        updated_at: true,
        enrollment_date: true,
        enrollment_id: true,
        feedback_course: true,
        payment_status: true,
        grade: true,
      },
    });
    const [fields] = await Promise.all([fieldsPromise]);

    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getStudentEnrollment;

