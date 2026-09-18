// app/api/claudeMailWebhook/route.ts
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.HOSTINGER_MAIL_WEBHOOK_SECRET!;
const API_TOKEN = process.env.HOSTINGER_API_TOKEN!;
const MAILBOX_ID = "AC229400be9585da92e384c402f4fe"; // info@zervired.com
const NOTIFY_TO = "tomyshellby74@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    console.log("FULL PAYLOAD:", JSON.stringify(payload, null, 2));
    const { uid, path } = payload.data;

    const msgRes = await fetch(
      `https://api.mail.hostinger.com/api/v1/mailboxes/${MAILBOX_ID}/folders/${encodeURIComponent(path)}/messages/${uid}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    const msgJson = await msgRes.json();
    console.log("MSG FETCH STATUS:", msgRes.status);
    console.log("MSG FETCH BODY:", JSON.stringify(msgJson, null, 2));
    
    const msg = msgJson.data;

    const summaryText = `New email received:
    From: ${msg.from?.name ?? ""} <${msg.from?.address ?? ""}>
    Subject: ${msg.subject}
    Date: ${msg.date}`;

    await fetch(
      `https://api.mail.hostinger.com/api/v1/mailboxes/${MAILBOX_ID}/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: [NOTIFY_TO],
          subject: `New mail: ${msg.subject}`,
          text: summaryText,
        }),
      }
    );

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}