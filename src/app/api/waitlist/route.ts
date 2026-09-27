import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIST = /^[a-z0-9:\-_ ]{1,120}$/i;

type Payload = { email?: unknown; list?: unknown; company?: unknown };

/**
 * Waitlist / pre-order / newsletter sign-ups. Validates, then forwards to
 * WAITLIST_WEBHOOK_URL (Zapier, Make, n8n, Google Apps Script, Slack…).
 * Without a webhook it only logs — fine for previews, not for launch.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → a bot. Pretend success so it doesn't retry.
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const list = typeof body.list === "string" ? body.list.trim() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }
  if (!LIST.test(list)) {
    return NextResponse.json({ error: "Invalid list." }, { status: 422 });
  }

  const entry = { email, list, createdAt: new Date().toISOString(), source: "mahve-web" };
  const webhook = process.env.WAITLIST_WEBHOOK_URL;

  if (!webhook) {
    console.info("[waitlist] WAITLIST_WEBHOOK_URL not set — sign-up not stored:", entry);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[waitlist] forwarding failed", err);
    return NextResponse.json({ error: "We couldn't save that just now — please try again in a moment." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
