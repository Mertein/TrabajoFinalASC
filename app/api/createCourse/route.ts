import { NextResponse } from "next/server";
import {getServerSession} from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";

interface RequestBody {
  course_name: string;
  description_course: string;
  price_course: number;
  category_id: number;
  id_branch: number;
  start_date: Date;
  end_date: Date;
  course_id: number;
  discount_percentage: number; 
  apply_discount: boolean;
  start_date_discount: Date;
  end_date_discount: Date;
  schedule: [
    {
      date: string; // Change to string type
      start_time: string;
      end_time: string;
      schedule_id?: number;
      class_id?: number;
    }
  ],
  scheduleLength: number;
  isFree : boolean;
  user_id: number;
  description: [string];

}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;

  if (user_id === undefined) {
    throw new Error("User ID not found in session"); // Handle the case where user_id is undefined
  }
  const body:RequestBody = await request.json();
    try {          

      const verifyIfExistShedule = body.schedule.map(async (scheduleItem) => {
        // Verificar si existe una clase con horario superpuesto en la misma sucursal
          const isOverlapping = await prisma.schedules.findFirst({
            where: {
              branch_id: body.id_branch,
              date: new Date(scheduleItem.date),
              OR: [
                {
                  AND: [
                    { start_time: { lte: scheduleItem.end_time } },
                    { end_time: { gte: scheduleItem.start_time } },
                  ],
                },
                {
                  AND: [
                    { start_time: { gte: scheduleItem.start_time } },
                    { start_time: { lte: scheduleItem.end_time } },
                  ],
                },
              ],
            },
          });
          return isOverlapping;
          
      });
      
      const verifyIfExistSheduleResult = await Promise.all(verifyIfExistShedule);

      var errorMessage = "Existen horarios superpuestos en la misma sucursal.";
      
      if (verifyIfExistSheduleResult.some(result => result !== null)) {
          console.log('verifyIfExistShedule:', verifyIfExistSheduleResult);
          return NextResponse.json({ error: errorMessage });
      }
    const createCourse = await prisma.course.create({
        data: {
            course_name: body.course_name,
            price_course: body.price_course,
            description_course: body.description_course,
            user_id: parseInt(user_id),
            category_id: body.category_id,
            id_branch: body.id_branch,
            isFree : body.isFree,
            description: body.description,
            start_date: new Date(body.start_date), 
            end_date: new Date(body.end_date),
            discount_percentage: body.discount_percentage,
            start_date_discount : body.start_date_discount ? new Date(body.start_date_discount) : null,
            end_date_discount : body.end_date_discount ? new Date(body.end_date_discount) : null,
            apply_discount: body.apply_discount,
        },
    });

    const createClassPromise = body.schedule.map(async (scheduleItem) => {
      try {
          const createClass = await prisma.class_course.create({
              data: {
                  course_id: createCourse.course_id,
                  description_class: '',
                  isVirtual: false,
              },
          }); 
          console.log('Class created:', createClass);
          return createClass; // Return the created class object
      } catch (error) {
          console.error('Error creating class:', error);
          throw error;
      }
    });

  

    const createClass = await Promise.all(createClassPromise);
    console.log(createClass);
    if(createClass.length > 0) {
    const createSchedulesPromises = body.schedule.map(async (scheduleItem, index) => {
      try {
          const createShedule = await prisma.schedules.create({
              data: {
                  start_time: scheduleItem.start_time, 
                  end_time: scheduleItem.end_time,   
                  date: new Date(scheduleItem.date),
                  branch_id: body.id_branch,
                  class_id: createClass[index].class_id,
              },
          });
          console.log('Schedule created:', createShedule);
          return createShedule; // Return the created schedule object
      } catch (error) {
          console.error('Error creating schedule:', error);
          throw error;
      }
    });
    const createdSchedules = await Promise.all(createSchedulesPromises);
    return NextResponse.json({ createCourse, createdSchedules });

  }
  } catch (error) {
    throw error;
  }
}
  
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.user_id;

  if (user_id === undefined) {
    throw new Error("User ID not found in session"); 
  }

  const body:RequestBody = await request.json();
  console.log(body)

    try {  
        // Obtener las clases existentes para el curso específico
        const existingClasses = await prisma.class_course.findMany({
          where: {
            course_id: body.course_id, // Filtrar por el ID del curso
          },
        });
  
        // Obtener las programaciones existentes para las clases existentes
        const existingSchedules = await prisma.schedules.findMany({
          where: {
            class_id: {
              in: existingClasses.map((cls) => cls.class_id),
            },
          },
        });

        const verifyIfExistShedule = body.schedule.map(async (scheduleItem) => {
          // Verificar si existe una clase con horario superpuesto en la misma sucursal
            const isOverlapping = await prisma.schedules.findFirst({
              where: {
                branch_id: body.id_branch,
                date: new Date(scheduleItem.date),
                OR: [
                  {
                    AND: [
                      { start_time: { lte: scheduleItem.end_time } },
                      { end_time: { gte: scheduleItem.start_time } },
                    ],
                  },
                  {
                    AND: [
                      { start_time: { gte: scheduleItem.start_time } },
                      { start_time: { lte: scheduleItem.end_time } },
                    ],
                  },
                ],
              },
            });
  
            const isExistingSchedule = existingSchedules.some((existingSchedule) => {
              return (
                existingSchedule.date !== null &&
                existingSchedule.date.toISOString() ===
                new Date(scheduleItem.date).toISOString()
              );
            });
  
             // Retornar la superposición solo si no es una programación existente
            if (isOverlapping && !isExistingSchedule) {
              return isOverlapping;
            } else {
              return null;
            }
        });
      
      const verifyIfExistSheduleResult = await Promise.all(verifyIfExistShedule);

      var errorMessage = "Existen horarios superpuestos en la misma sucursal.";
      
      if (verifyIfExistSheduleResult.some(result => result !== null)) {
          console.log('verifyIfExistShedule:', verifyIfExistSheduleResult);
          return NextResponse.json({ error: errorMessage });
      }
    console.log(body.description)
    const updateCoursePromises = await prisma.course.update({
        where: {
          course_id: body.course_id,
        },
        data: {
            course_name: body.course_name,
            price_course: body.price_course,
            description_course: body.description_course,
            user_id: parseInt(user_id),
            category_id: body.category_id,
            id_branch: body.id_branch,
            isFree : body.isFree,
            description: body.description,
            start_date: new Date(body.start_date), 
            end_date: new Date(body.end_date),
            discount_percentage: body.discount_percentage,
            start_date_discount : new Date(body.start_date_discount),
            end_date_discount : new Date(body.end_date_discount),
            apply_discount: body.apply_discount,
        },
    });

    const createSchedulesPromises = body.schedule.map(async (scheduleItem) => {
      try {
          if(scheduleItem.class_id && scheduleItem.class_id > 0) {
            const createShedule = await prisma.schedules.update({
              where: {
                shedule_id: scheduleItem.schedule_id,
              },
              data: {
                start_time: scheduleItem.start_time, 
                end_time: scheduleItem.end_time,    
                date: new Date(scheduleItem.date),
                branch_id: body.id_branch,
              },
          });
          return createShedule; // Return the created schedule object
          } else if (!scheduleItem.class_id ) {
            const createClass = await prisma.class_course.create({
              data: {
                course_id: Number(body.course_id),
                description_class: '',
                isVirtual: false,
              },
            });
            if(createClass) {
              const createShedule = await prisma.schedules.create({
                data: {
                  start_time: scheduleItem.start_time,
                  end_time: scheduleItem.end_time,
                  date: new Date(scheduleItem.date),
                  branch_id: body.id_branch,
                  class_id: createClass.class_id,
                },
              });
              return createShedule; // Return the created schedule object
            return createClass; // Return the created schedule object
            }
          }
          console.log('Schedule created:'); // Return the created schedule object
      } catch (error) {
          console.error('Error creating schedule:', error);
          throw error;
      }
    });
    const createdSchedules = await Promise.all(createSchedulesPromises);
    const updateCourse = await Promise.all([updateCoursePromises]);
    return NextResponse.json({ updateCourse, createdSchedules });
  } catch (error) {
    throw error;
  }
}

