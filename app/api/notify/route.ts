import mercadopago from "mercadopago";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";


mercadopago.configure({
  access_token: process.env.MERCADOPAGO_API_KEY!
});

export async function POST(req: NextRequest, res: NextResponse ) {
  const body = await req.json();
  try {
    if (body.type === "payment") {
      const paymentId = body.data.id;
      let payment = await mercadopago.payment.findById(Number(paymentId));
      let paymentStatus = payment.body.status;
      console.log(payment.body);
      if(paymentStatus === "approved") {
        try {
          console.log('entre al if')
          const enrollmentPromise = await prisma.enrollment_course.create({
            data: {
              user_id: Number(payment.body.additional_info.items[0].category_id),
              course_id: Number(payment.body.additional_info.items[0].id),
              enrollment_date: payment.body.date_created,
              payment_status: payment.body.status === "approved" ? true : false,
              completion_status: false,
            }
          })
          const enrolmentId = enrollmentPromise.enrollment_id;
          if(enrollmentPromise) {
            console.log(enrollmentPromise)
            const paymentPromise = await prisma.payment.create({
              data: {
                payment_amount: payment.body.transaction_amount,
                transaction_id: Number(paymentId),
                payment_date: payment.body.date_created,
                payment_method: payment.body.payment_method_id,
                payment_status: payment.body.status === "approved" ? 1 : 0,
                enrollment_id: enrolmentId,
            }
          })
          const [fields] = await Promise.all([enrollmentPromise, paymentPromise]);
          return NextResponse.json(fields);
          } else {
            console.log("Error al crear la inscripcion al curso en la bd");
          }
        }
        catch (error) {
          console.log(error);
        }
      }
      return NextResponse.json('Exito');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
