// @ts-nocheck
import mercadopago from 'mercadopago';
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {

    try {
      console.log(req.body)
        const payment = req.body;
        console.log(payment);
       
        if (payment.type === "payment") {
          const data = await mercadopago.payment.findById(payment["data.id"]);
          console.log(data);
        }
    
        return NextResponse.json({ message: "ok" });
      } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something goes wrong" });
      }
}


