
import prisma from "../../lib/prismadb";
import {getServerSession} from 'next-auth';
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";

const getMyEnrollments = async () => {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;
  try {
    const fieldsPromise = await prisma.enrollment_course.findMany({
      where: {
        user_id: Number(user_id),
      },
      select: {
        usser: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          }
        },
        files: {
          where: {
            identifier: "studentCertificateCourse"
          },
          select: {
            name: true,
            type: true,
            link: true,
            path: true,
            thumbnail: true,
          },
        },
        course: {
          select: {
            course_name: true,
            description_course: true,
            end_date: true,
            start_date: true,
          },
        },
      }
    });
    const [fields] = await Promise.all([fieldsPromise]);

    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getMyEnrollments;

