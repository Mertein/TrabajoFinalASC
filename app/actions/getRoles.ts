
import prisma from "../../lib/prismadb";

type Roles = {
  rol_name: string,
  rol_id: number,
  create_at: string,
  delete_at: string,
  update_at: string,
}

const getRoles = async (): Promise<Roles[]> => {
  try {
    const fieldsPromise = prisma.rol.findMany();

    const [fields] = await Promise.all([fieldsPromise]);

    return (fields as any) || [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export default getRoles;