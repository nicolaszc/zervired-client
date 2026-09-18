// app/api/claudeMailWebhook/route.ts
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.HOSTINGER_MAIL_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  // 1. Verify the bearer secret Hostinger sends
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Parse the payload
  const payload = await req.json();
  console.log("New mail webhook:", payload);

  // TODO: do something with payload (e.g. notify, store, forward)

  // 3. Respond fast with 2xx so Hostinger marks delivery as successful
  return NextResponse.json({ received: true }, { status: 200 });
}