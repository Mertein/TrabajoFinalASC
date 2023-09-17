import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const fieldsPromise = prisma.branch_offices.findMany({
      select: {  
        branch_name: true,
        branch_address: true,
        branch_id: true,
        people_capacity: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
      },
    }); 
    
    const [fields] = await Promise.all([fieldsPromise]);
    return NextResponse.json(fields);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function POST(request: Request) {

  const body = await request.json();
  console.log(body)
  
  
    const branchOffices = await prisma.branch_offices.create({
      data: {
        branch_name: body.branch_name,
        branch_address: body.branch_address,
        people_capacity: Number(body.people_capacity),
      },
    })
    return new NextResponse(JSON.stringify(branchOffices), {status: 200});

};


export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  const {data} = body;
  const {branch_id, branch_name, branch_address, people_capacity} = data;
  try {
    const updateBranch = await prisma.branch_offices.update({
      where: {
        branch_id,
      },
      data: {
        branch_name,
        branch_address,
        people_capacity: Number(people_capacity),
      }
    })
    const [fields] = await Promise.all([updateBranch]);
    return NextResponse.json(fields);
  } catch (error) {
    console.log(error);
  }
}