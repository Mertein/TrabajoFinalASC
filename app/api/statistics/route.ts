import prisma from "../../../lib/prismadb";
import { NextResponse } from "next/server";

// Course Category Distribution:
// Graph Type: Pie Chart or Bar Chart
// Data: Percentage or count of courses in each category.
// Insights: You can understand which categories are more popular and might need more attention or marketing.
export async function GET(req: Request, res: Response) {
  try {
    const fieldsPromise = await prisma.course.groupBy({
      by: ['category_id'],
      _count: {
        course_id: true,
      },
    });

    const categories = await prisma.category_course.findMany();
    const categoryDistribution = categories.map(category => {
      const count = fieldsPromise.find(item => item.category_id === category.category_id);
      return {
        category_name: category.category_name,
        count: count ? count._count.course_id : 0,
      };
    });
    console.log(fieldsPromise);
    console.log('categoryDistributon', categoryDistribution);
    return new NextResponse(JSON.stringify(categoryDistribution), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

export async function POST(req: Request, res: Response) {

}

export async function PUT(req: Request, res: Response) {
}

