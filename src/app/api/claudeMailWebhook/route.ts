import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    
    const rawBody = await req.text();

    console.log("📩 Incoming webhook:", rawBody);



   

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}