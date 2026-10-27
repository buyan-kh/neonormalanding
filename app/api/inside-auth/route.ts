import { NextResponse } from "next/server";
import {
  createSessionToken,
  credentialsMatch,
  INSIDE_COOKIE,
  requestIsSecure,
  sessionCookieOptions,
} from "@/lib/inside-auth";

function destination(request: Request, denied: boolean) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || new URL(request.url).host;
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || new URL(request.url).protocol.replace(":", "");
  const hostname = host.split(":")[0].toLowerCase();
  const onInsideHost = hostname === "inside.neonorma.si" || hostname === "inside.localhost";
  const url = new URL(`${proto}://${host}/`);
  url.pathname = onInsideHost ? "/" : "/inside";
  url.search = denied ? "?denied=1" : "";
  return url;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const form = await request.formData();
  const intent = String(form.get("intent") ?? "enter");
  const secure = requestIsSecure(request);

  if (intent === "lock") {
    const response = NextResponse.redirect(destination(request, false), 303);
    response.cookies.set(INSIDE_COOKIE, "", { ...sessionCookieOptions(secure), maxAge: 0 });
    return response;
  }

  const name = String(form.get("name") ?? "");
  const passcode = String(form.get("passcode") ?? "");
  if (!credentialsMatch(name, passcode)) {
    const response = NextResponse.redirect(destination(request, true), 303);
    response.cookies.set(INSIDE_COOKIE, "", { ...sessionCookieOptions(secure), maxAge: 0 });
    return response;
  }

  const response = NextResponse.redirect(destination(request, false), 303);
  response.cookies.set(INSIDE_COOKIE, createSessionToken(), sessionCookieOptions(secure));
  return response;
}
