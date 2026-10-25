import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/contact";

type Intent = "sample" | "partner";

type IntakeBody = {
  name?: unknown;
  institution?: unknown;
  email?: unknown;
  intent?: unknown;
  note?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: "Unreadable payload." }, { status: 400 });
  }

  if (raw.length > 8000) {
    return NextResponse.json({ ok: false, error: "Payload is too large." }, { status: 413 });
  }

  let body: IntakeBody;
  try {
    body = JSON.parse(raw) as IntakeBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Payload must be JSON." }, { status: 400 });
  }

  const name = asText(body.name, 120);
  const institution = asText(body.institution, 160);
  const email = asText(body.email, 180);
  const note = asText(body.note, 2000);
  const intent = body.intent === "partner" || body.intent === "sample" ? (body.intent as Intent) : null;

  if (!name) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (!institution) {
    return NextResponse.json({ ok: false, error: "Institution is required." }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "Email is invalid." }, { status: 400 });
  }
  if (!intent) {
    return NextResponse.json({ ok: false, error: "Intent must be sample or partner." }, { status: 400 });
  }

  const webhook = process.env.INTAKE_WEBHOOK;
  if (!webhook) {
    return NextResponse.json({
      ok: true,
      delivered: false,
      reason: "sink_unconfigured",
      email: CONTACT_EMAIL,
    });
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, institution, email, intent, note, source: "neonorma-landing" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) {
      return NextResponse.json({ ok: true, delivered: false, reason: "sink_rejected" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: true, delivered: false, reason: "sink_unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
