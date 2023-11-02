
import prisma from "../../lib/prismadb";
import {getServerSession} from 'next-auth';
import { authOptions } from "../api/auth/[...nextauth]/route";

const getMySignature = async () => {
    const session = await getServerSession(authOptions);
    const user_id = session?.user?.user_id;
    try {
  
    const fieldsPromise = await prisma.files.findFirst({
      where: {
        user_id: Number(user_id),
        identifier: 'userSignature',
      },
      select: {
        id: true,
        link: true,
        path: true,
        thumbnail: true,
        name: true,
        // size: true,
        type: true,
        format: true,
        certificate_id: true,
        user_id: true,
        identifier: true,
        enrollment_id: true,
        category_id: true,
        course_id: true,
        title: true,
      }
    });
    
    const [fields] = await Promise.all([fieldsPromise]);
    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getMySignature;