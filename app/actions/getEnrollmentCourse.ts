import prisma from "../../lib/prismadb";
async function getEnrollmentCourse() {
  try {
    const fieldsPromise = prisma.enrollment_course.findMany({
      select: {
        enrollment_id: true,
        feedback_course: true,
        payment_status  : true,
        enrollment_date: true,
        completion_status: true,
        user_id: true,
        course_id: true,
        files: {
          where: {
            identifier: "studentCertificateCourse"
          },
          select: {
            id: true,
            name: true,
            type: true,
            identifier: true,
            path: true,
            user_id: true,
          },
        },
        course: {
          select: {
            course_id: true,
            course_name: true,
            price_course: true,
            description_course: true,
            user_id: true,
            category_id: true,
            id_branch: true,
            end_date: true,
            start_date: true,
            isFree: true,
            isVirtual: true,
            description: true,
            usser: {
              select: {
                first_name: true,
                last_name: true,
                dni: true,
              }
            },
            category_course: true,
          },
        },
        usser: {
          select: {
            files: {
              where: {
                identifier: "studentCertificateCourse",
              },
              select: {
                id: true,
                name: true,
                type: true,
                identifier: true,
                path: true,
                user_id: true,
              },
            },
          first_name: true,
          last_name: true,
          dni: true,
          },
        },
        grade: {
          select: {
            grade_id: true,
            value: true,
          },
        },
      },
    });

    const [fields] = await Promise.all([fieldsPromise]);

    const convertedFields = fields.map((field) => {
      return {
        ...field,
        usser: {
          ...field.usser,
          dni: field.usser.dni.toString(), // Convertir Decimal a cadena
        },
        course: {
          ...field.course,
          usser: {
            ...field.course.usser,
            dni: field.course.usser.dni.toString(), // Convertir Decimal a cadena
          }
        },
      };
    });

    return (convertedFields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export default getEnrollmentCourse;
