
import prisma from "../../lib/prismadb";

type BranchOffices = {
  branch_name: string;
  branch_address: string;
  branch_id: number;
  people_capacity: number;
}

const getBranchOffices = async (): Promise<BranchOffices[]> => {
  try {
    const fieldsPromise = prisma.branch_offices.findMany({
      select: {  
        branch_name: true,
        branch_address: true,
        branch_id: true,
        people_capacity: true,
      },
    }); 
    
    const [fields] = await Promise.all([fieldsPromise]);
    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getBranchOffices;