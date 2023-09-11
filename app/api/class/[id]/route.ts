// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const deleteClass = await prisma.class_course.delete({
      where: {
        class_id: Number(id),
      }
    })
    const [fields] = await Promise.all([deleteClass]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req: Request, {params} : {params: {id: string}}) {
  const { id } = params;
  try {
    const fields = await prisma.class_course.findMany({
      where: {
        course_id: Number(id),
      },
      include: {
        schedules: true,
      },
      orderBy: {
        class_id: "asc",
      },
    });

    const classesWithFiles = await Promise.all(
      fields.map(async (clase) => {
        const files = await prisma.files.findMany({
          where: {
            class_id: clase.class_id,
          },
        });
  
        return {
          ...clase,
          files: files,
        };
      })
    );

    const sortedClasses = classesWithFiles.sort((a, b) => {
      const dateA = new Date(a.schedules[0].date); // Tomamos la primera fecha en el array.
      const dateB = new Date(b.schedules[0].date); // Tomamos la primera fecha en el array.
      return dateA - dateB;
    });
    
    return NextResponse.json(sortedClasses);
  } catch (error) {
    console.log(error);
    return new NextResponse("Database Error", {status: 500});

  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { id } = params;

  try {
    const createClass = await prisma.class_course.create({
      data: {
        course_id: Number(id),
        description_class: '',
        isVirtual: false,
      },
    });
    return NextResponse.json(createClass);
  }
  catch (error) {
    console.log(error);
    return new NextResponse("Database Error", {status: 500});
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { id } = params;
  try {
    const classBySchedule = await prisma.schedules.findFirst({
      where: {
        class_id: Number(id),
      },
    });


    if(classBySchedule) {
      console.log('entre al if')
      return NextResponse.json(classBySchedule);
    } else {
    console.log('entre al else');
    const createClass = await prisma.schedules.create({
      data: {
        start_time: body.start_time, 
        end_time: body.end_time,   
        date: new Date(body.date),
        branch_id: body.id_branch,
        class_id: Number(id),
    },
    });
    return NextResponse.json(createClass);
    } 
  }
  catch (error) {
    console.log(error);
    return new NextResponse("Database Error", {status: 500});
  }
}
