import { Select } from "@mui/material";
import prisma from "../../lib/prismadb";


const getCertificateValidate = async (id: number) => {
  try {
    const fieldsPromise = prisma.enrollment_course.findUnique({
      where: {
        enrollment_id: Number(id),
      },
      select: {
        usser: {
          select: {
          first_name: true,
          last_name: true,
          },
        },
        files: {
          where: {
            identifier: "studentCertificateCourse"
          }
        }
      },
    });
    const [fields] = await Promise.all([fieldsPromise]);
    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getCertificateValidate;

