// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(req: Request, res: Response) {
 const {searchParams} = new URL(req.url);
 const categoryFilter = searchParams.get("category");
 const startDateFilter = searchParams.get('startDate');
 const endDateFilter = searchParams.get('endDate');
 try {
  const filters = {
    where: {},
  };

   // Filtrar por categoría si se proporciona
   if (categoryFilter && !isNaN(Number(categoryFilter))) {
    filters.where.category_id = Number(categoryFilter);
  }

  // Filtrar por fecha de inicio si se proporciona
  if (startDateFilter && !isNaN(new Date(startDateFilter).getTime())) {
    filters.where.start_date = {
      gte: new Date(startDateFilter),
    };
  }

  // Filtrar por fecha de finalización si se proporciona
  if (endDateFilter && !isNaN(new Date(endDateFilter).getTime())) {
    filters.where.end_date = {
      lte: new Date(endDateFilter),
    };
  }

  const fieldsPromise = await prisma.course.groupBy({
    by: ['category_id'],
    _count: {
      course_id: true,
    },
    ...filters, // Aplicar los filtros a la consulta
  });

  const categories = await prisma.category_course.findMany();
  const categoryDistribution = categories.map(category => {
    const count = fieldsPromise.find(item => item.category_id === category.category_id);
    return {
      category_name: category.category_name,
      count: count ? count._count.course_id : 0,
    };
  });
  return NextResponse.json(categoryDistribution);
} catch (error) {
  console.error(error);
  throw error;
}
};
