import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/contact";

type Intent = "labs" | "data" | "investors";

type IntakeBody = {
  name?: unknown;
  institution?: unknown;
  organization?: unknown;
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
  const organization = asText(body.organization, 160) || asText(body.institution, 160);
  const email = asText(body.email, 180);
  const note = asText(body.note, 2000);
  const rawIntent = asText(body.intent, 40);
  const intent: Intent | null =
    rawIntent === "labs" || rawIntent === "sample"
      ? "labs"
      : rawIntent === "data" || rawIntent === "partner"
        ? "data"
        : rawIntent === "investors"
          ? "investors"
          : null;

  if (!name) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (!organization) {
    return NextResponse.json({ ok: false, error: "Organization is required." }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "Email is invalid." }, { status: 400 });
  }
  if (!intent) {
    return NextResponse.json({ ok: false, error: "Intent must be labs, data, or investors." }, { status: 400 });
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
      body: JSON.stringify({ name, organization, email, intent, note, source: "neonorma-landing" }),
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
