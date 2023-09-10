
import prisma from "../../lib/prismadb";
import {SessionStrategy, getServerSession} from 'next-auth';
import { authOptions } from "../api/auth/[...nextauth]/route";


const getStudentEnrollment = async (id: number) => {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;
  try {
    const fieldsPromise = prisma.enrollment_course.findFirst({
      where: {
        course_id: Number(id),
        user_id: Number(user_id),

      }
    });

    const [fields] = await Promise.all([fieldsPromise]);

    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getStudentEnrollment;

