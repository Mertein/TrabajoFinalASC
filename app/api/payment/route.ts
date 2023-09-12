import mercadopago from 'mercadopago';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { NextResponse, NextRequest } from "next/server";
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_API_KEY!
});

export async function POST(req: NextRequest, res: NextResponse ) {
	const body = await req.json();
	try {
		const unit_price = body.discountedPrice !== undefined
      ? body.discountedPrice
      : body.course.price_course;
		const preference: CreatePreferencePayload = {
		  items: [
			{
			  title: body.course.course_name,
				id: body.course.course_id,
			  unit_price: unit_price ,
			  quantity: 1,	
				category_id: body.user_id.toString(),
			},
		  ],
		  auto_return: "approved",
		  back_urls: {
			success: `${process.env.NEXTAUTH_URL}/student/viewCourses/${body.course.course_id}`,
			failure: `${process.env.NEXTAUTH_URL}/student/viewCourses/${body.course.course_id}`,
		  },
		  notification_url: `${process.env.NEXTAUTH_URL}/api/notify`,
		};
  
		const response = await mercadopago.preferences.create(preference);
		const {init_point} = response.body
		return NextResponse.json({init_point});
	  } catch (error) {
		console.log(error);
	  }
}





