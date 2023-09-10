import prisma from "../../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params} : any) {
  const {id} = params;
  try {
    const coursePromise = await prisma.course.findFirst({
      where: {
        course_id: Number(id),
      },
      include: {
        branch_offices: {
          select: {
            people_capacity: true,
            branch_address: true,
            branch_name : true,
            branch_id : true,
          }
        },
        category_course: true,
        usser: {
          include: {
            files: {
              where: {
                identifier: 'userPicture',
              },
            },
          }
        },
        files: {
          select : {
            id: true,
            name: true,
            type: true,
            course_id: true,
            size: true,
            title: true,
            link: true,
            path : true,
          },
        },
        class_course: {
          include: {
            schedules: {
              select: {
                date: true,
                start_time: true,
                end_time: true,
                class_id: true,
                shedule_id: true,
              },
            },
          },
        },
      },
    });  

    // if (coursePromise && coursePromise.branch_offices && !Array.isArray(coursePromise.branch_offices)) {
    //   if (coursePromise.branch_offices.schedules && Array.isArray(coursePromise.branch_offices.schedules)) {
    //     const updatedSchedules = coursePromise.branch_offices.schedules.map((schedule) => {
    //       const startTime = new Date(schedule.start_time);
    //       const endTime = new Date(schedule.end_time);

    //       return {
    //         ...schedule,
    //         start_time: startTime.toLocaleTimeString('es-AR', { timeZone: 'UTC', hour12: false}),
    // end_time: endTime.toLocaleTimeString('es-AR', { timeZone: 'UTC', hour12: false })
    //       };
    //     });

    //     const updatedBranchOffices = {
    //       ...coursePromise.branch_offices,
    //       schedules: updatedSchedules
    //     };

    //     coursePromise.branch_offices = updatedBranchOffices;
    //   }
    // }

    return new NextResponse(JSON.stringify(coursePromise), {status: 200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

