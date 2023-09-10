import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
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
    return NextResponse.json(convertedFields);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const enrollmentDate = new Date(body.enrollment_date);
  console.log(body);
  if(body.isFree === false) {
     try {
    const fieldsPromise = prisma.enrollment_course.create({
      data: {
        payment_status  : body.paymment_status,
        enrollment_date: enrollmentDate,
        completion_status: false,
        user_id: body.user_id,
        course_id: body.course_id,
        },
    });

    const [fields] = await Promise.all([fieldsPromise]);
    return NextResponse.json(fields);
  } catch (error) {
    console.error(error);
    throw error;
  }
  } else {
      try {
    const fieldsPromise = prisma.enrollment_course.create({
      data: {
        payment_status  : true,
        enrollment_date: enrollmentDate,
        completion_status: false,
        user_id: body.user_id,
        course_id: body.course_id,
        },
    });

    const [fields] = await Promise.all([fieldsPromise]);
    return NextResponse.json(fields);
  } catch (error) {
    console.error(error);
    throw error;
  }
 
  }
}




// export async function PUT(req: Request, res: Response) {
//   const body = await req.json();
//   const {data} = body;
//   const {branch_id, branch_name, branch_address, people_capacity} = data;
//   try {
//     const updateBranch = await prisma.branch_offices.update({
//       where: {
//         branch_id,
//       },
//       data: {
//         branch_name,
//         branch_address,
//         people_capacity,
//       }
//     })
//     const [fields] = await Promise.all([updateBranch]);
//     return NextResponse.json(fields);
//   } catch (error) {
//     console.log(error);
//   }
// }