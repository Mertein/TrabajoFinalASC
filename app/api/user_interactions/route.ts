import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const faqs = await prisma.faqs.findMany();
    const preguntasPopulares = await Promise.all(
      faqs.map(async (faq) => {
        const likes = await prisma.user_interactions.count({
          where: { faq_id: faq.id, isLike: true },
        });
    
        const dislikes = await prisma.user_interactions.count({
          where: { faq_id: faq.id, isLike: false },
        });
    
        const categoria = faq.category; // Agrega la categoría
    
        const feedback = await prisma.user_interactions.findFirst({ // Agrega el feedback
          where: { faq_id: faq.id, isLike: false },
          select: { feedback: true },
        });
    
        return {
          faqId: faq.id,
          pregunta: faq.question,
          respuesta: faq.answer,
          likes,
          dislikes,
          categoria, // Agrega la categoría
          feedback: feedback ? feedback.feedback : null, // Agrega el feedback
        };
      })
    );

    const obtenerUltimaActualizacionPromise = await prisma.updateTime.findFirst({
      where: { id: 2 },
    });

    const ultimaActualizacion = await Promise.all([obtenerUltimaActualizacionPromise]);

    const preguntasOrdenadas = await Promise.all(preguntasPopulares);

    // Ordena las preguntas por likes para obtener la más popular
    const preguntaMasPopular = preguntasOrdenadas.reduce((prev, current) => (prev.likes > current.likes ? prev : current));

    // Encuentra una pregunta menos popular (sin likes ni dislikes)
    const preguntaMenosPopular = preguntasOrdenadas.find((pregunta) => pregunta.likes === 0 && pregunta.dislikes === 0);

    // Ordena las preguntas por dislikes para obtener la más disgustada
    const preguntaMasDisgustada = preguntasOrdenadas.reduce((prev, current) => (prev.dislikes > current.dislikes ? prev : current));

    console.log('Pregunta más popular:');
    console.log(preguntaMasPopular);
    console.log('Pregunta menos popular (sin likes ni dislikes):');
    console.log(preguntaMenosPopular);
    console.log('Pregunta más disgustada:');
    console.log(preguntaMasDisgustada);
    // Puedes retornar respuestas en formato JSON con los resultados si lo deseas
    return new NextResponse(JSON.stringify({ preguntaMasPopular, preguntaMenosPopular, preguntaMasDisgustada, ultimaActualizacion  }), { status: 200 });
    
  } catch (error) {
    // Maneja el error según tus necesidades
    console.error('Error al verificar preguntas populares:', error);
    return new NextResponse("Database Error", { status: 500 });
  }
}
