import { NextResponse } from "next/server";


export async function  POST(req: Request, res: Response) {
  
  const request = await req.json();
  console.log(JSON.parse(request));
  // Aquí puedes procesar y guardar los datos en tu base de datos
  
  return NextResponse.json('Exito');

}