// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let whereCondition = {}; // Condición de búsqueda inicial

    if (startDate && endDate) {
      // Si se proporcionan ambas fechas, aplicar el filtro completo
      whereCondition = {
        created_at: {
          gte: new Date(startDate), // Filtrar por fecha de inicio
          lte: new Date(endDate),   // Filtrar por fecha de finalización
        },
      };
    } else if (startDate) {
      // Si solo se proporciona fecha de inicio, aplicar el filtro de inicio
      whereCondition = {
        created_at: {
          gte: new Date(startDate), // Filtrar por fecha de inicio
        },
      };
    } else if (endDate) {
      // Si solo se proporciona fecha de finalización, aplicar el filtro de finalización
      whereCondition = {
        created_at: {
          lte: new Date(endDate), // Filtrar por fecha de finalización
        },
      };
    }

    const enrollments = await prisma.enrollment_course.findMany({
      where: whereCondition, // Aplicar la condición de búsqueda
    });

    const fieldsPromise = enrollments.reduce((accumulator, enrollment) => {
      const month = enrollment.created_at.getMonth() + 1; // Los meses se cuentan desde 0
      const year = enrollment.created_at.getFullYear();
      const key = `${year}-${month}`;

      if (!accumulator[key]) {
        accumulator[key] = {
          date: new Date(year, month - 1), // Los meses se cuentan desde 0
          count: 0,
        };
      }
      accumulator[key].count++;

      return accumulator;
    }, {});

    const enrollmentTrend = Object.values(fieldsPromise);

    return new NextResponse(JSON.stringify(enrollmentTrend), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse("Database Error", { status: 500 });
  }
}
