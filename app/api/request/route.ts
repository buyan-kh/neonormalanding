import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO = "hi@neonorma.si";
const FROM_FALLBACK = "Neo Norma <onboarding@resend.dev>";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 8;

const hits = new Map<string, number[]>();

type Body = {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  role?: unknown;
  message?: unknown;
  source?: unknown;
  as?: unknown;
  nn_leave_blank?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F]+/g, " ").trim().slice(0, max);
}

function roleOf(value: string) {
  if (value === "lab" || value === "labs" || value === "sample") return "lab";
  if (value === "holder" || value === "data" || value === "partner") return "holder";
  if (value === "fund" || value === "investors") return "fund";
  return "";
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_HITS;
}

export async function POST(request: Request) {
  let raw = "";
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: "Unreadable payload." }, { status: 400 });
  }
  if (raw.length > 12000) {
    return NextResponse.json({ ok: false, error: "Payload is too large." }, { status: 413 });
  }

  let body: Body;
  try {
    body = JSON.parse(raw) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Payload must be JSON." }, { status: 400 });
  }

  if (limited(clientIp(request))) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  if (clean(body.nn_leave_blank, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const organization = clean(body.organization, 160);
  const role = roleOf(clean(body.role, 40));
  const message = clean(body.message, 2000);
  const source = clean(body.source, 200);
  const asParam = clean(body.as, 40);

  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  if (!emailPattern.test(email)) {
    return NextResponse.json({ ok: false, error: "Email is invalid." }, { status: 400 });
  }
  if (!organization) {
    return NextResponse.json({ ok: false, error: "Organization is required." }, { status: 400 });
  }
  if (!role) {
    return NextResponse.json({ ok: false, error: "Role is required." }, { status: 400 });
  }
  if (!source.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "Source is required." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ ok: false, error: "Mail is not configured." }, { status: 500 });
  }

  const resend = new Resend(key);
  const from = process.env.RESEND_FROM || FROM_FALLBACK;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Organization: ${organization}`,
    `Role: ${role}`,
    `Message: ${message || "(none)"}`,
    `Source: ${source}`,
    `As: ${asParam || "(none)"}`,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to: TO,
      replyTo: email,
      subject: `Neo Norma request (${role})`,
      text,
    });
    if (error) {
      console.error("Resend rejected the request");
      return NextResponse.json({ ok: false, error: "The request could not be sent." }, { status: 500 });
    }
  } catch {
    console.error("Resend request failed");
    return NextResponse.json({ ok: false, error: "The request could not be sent." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
