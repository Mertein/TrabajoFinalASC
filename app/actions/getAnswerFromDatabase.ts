
import prisma from "../../lib/prismadb";
const getAnswerFromDataBase = async (question : any) => {
  try {
    const fieldsPromise = await prisma.answer.findFirst({
      where: {
        question_answer: {
          some: {
            question: {
              ask: {
                equals: question,
              },
            },
          },
        },
      },
      select: {
        response: true,
      },
    });

    const [fields] = await Promise.all([fieldsPromise]);

    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getAnswerFromDataBase;