import { NextResponse } from "next/server";
import {
  createSessionToken,
  credentialsMatch,
  INSIDE_COOKIE,
  publicInsidePath,
  requestIsSecure,
  safeInsideNext,
  sessionCookieOptions,
} from "@/lib/inside-auth";

function destination(request: Request, denied: boolean, nextPath?: string | null) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || new URL(request.url).host;
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || new URL(request.url).protocol.replace(":", "");
  const hostname = host.split(":")[0].toLowerCase();
  const onInsideHost = hostname === "inside.neonorma.si" || hostname === "inside.localhost";
  const url = new URL(`${proto}://${host}/`);
  const next = safeInsideNext(nextPath);
  if (!denied && next) {
    url.pathname = publicInsidePath(next, onInsideHost);
    return url;
  }
  url.pathname = onInsideHost ? "/" : "/inside";
  const params = new URLSearchParams();
  if (denied) params.set("denied", "1");
  if (denied && next) params.set("next", next);
  const search = params.toString();
  if (search) url.search = `?${search}`;
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
  const nextPath = safeInsideNext(String(form.get("next") ?? ""));
  if (!credentialsMatch(name, passcode)) {
    const response = NextResponse.redirect(destination(request, true, nextPath), 303);
    response.cookies.set(INSIDE_COOKIE, "", { ...sessionCookieOptions(secure), maxAge: 0 });
    return response;
  }

  const response = NextResponse.redirect(destination(request, false, nextPath), 303);
  response.cookies.set(INSIDE_COOKIE, createSessionToken(), sessionCookieOptions(secure));
  return response;
}
