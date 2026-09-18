import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    
    const payload = await req.json();
    console.log("New mail webhook:", payload);



   

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

