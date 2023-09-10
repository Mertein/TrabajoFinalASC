import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;

  try {
    const paymentsPromise = await prisma.payment.findMany({
      include: {
        enrollment_course: {
          include: {
            course: true,
            usser: true,
          },
        }
      },
    });
    
    const payments = await Promise.all(paymentsPromise);

    // Filtrar los datos en los que enrollment_course tiene el user_id deseado
    const filteredPayments = payments.filter(payment => payment.enrollment_course.user_id === user_id);

    console.log(filteredPayments);
    
    return new NextResponse(JSON.stringify(filteredPayments), { status: 200 });
  } catch (error) {
    return new NextResponse("Database Error", { status: 500 });
  }
}

// export async function POST(request: Request) {
//   const body = await request.json();
//   const session = await getServerSession(authOptions);
//   const user_id = session?.user?.user_id;
//   console.log(body);
//   try {

//     const findExisting = await prisma.user_interactions.findUnique({
//       where: {
//         user_id_faq_id: {
//           user_id: user_id,
//           faq_id: body.faqId,
//         },
//       },
//     });

//     if(findExisting) {
//       if(body.feedback === "") {
//         const fieldsPromise = await prisma.user_interactions.update({
//           where: {
//             user_id_faq_id: {
//                 user_id: user_id,
//                 faq_id: body.faqId,
//              },
//             },
//           data: {
//               user_id: user_id,
//               faq_id: body.faqId,
//               isLike : body.isLike,
//           }
//         });
//         return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
//       } else {
//         const fieldsPromise = await prisma.user_interactions.update({
//           where: {
//             user_id_faq_id: {
//                 user_id: user_id,
//                 faq_id: body.faqId,
//              },
//             },
//           data: {
//               user_id: user_id,
//               faq_id: body.faqId,
//               feedback: body.feedback,
//               isLike : body.isLike,
//           }
//         });
//         return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
//       }
//     } else {
//       if(body.feedback === "") {
//         const fieldsPromise = await prisma.user_interactions.create({
//           data: {
//               user_id: user_id,
//               faq_id: body.faqId,
//               isLike : body.isLike,
//           }
//         });
//         return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
//       } else {
//         const fieldsPromise = await prisma.user_interactions.create({
//           data: {
//               user_id: user_id,
//               faq_id: body.faqId,
//               feedback: body.feedback,
//               isLike : body.isLike,
//           }
//         });
//         return new NextResponse(JSON.stringify(fieldsPromise), {status: 200});
//       }
//     }
//   } catch (error) {
//     return new NextResponse("Database Error", {status: 500});
//   }
// }