import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.HOSTINGER_MAIL_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // 1. Verify the bearer secret Hostinger sends
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    console.log("New mail webhook:", payload);



   

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

