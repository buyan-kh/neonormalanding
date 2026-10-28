import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { INSIDE_COOKIE, readSessionToken, safeInsideNext } from "@/lib/inside-auth";

const INSIDE_HOSTS = new Set(["inside.neonorma.si", "inside.localhost"]);

function hostnameOf(host: string) {
  return host.split(":")[0].toLowerCase().replace(/\.$/, "");
}

function isAsset(pathname: string) {
  return pathname.startsWith("/_next") || pathname.startsWith("/api") || /\.[a-z0-9]+$/i.test(pathname);
}

function isPortalPath(pathname: string) {
  return pathname === "/inside" || (pathname.startsWith("/inside/") && pathname !== "/inside/gate");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isAsset(pathname)) return NextResponse.next();

  const insideHost = INSIDE_HOSTS.has(hostnameOf(request.headers.get("host") ?? ""));
  const authed = readSessionToken(request.cookies.get(INSIDE_COOKIE)?.value) !== null;

  let target = pathname;
  if (insideHost && !isPortalPath(pathname) && pathname !== "/inside/gate") {
    target = pathname === "/" ? "/inside" : `/inside${pathname}`;
  }

  const requestedPortal = isPortalPath(target) ? target : null;
  if (requestedPortal && !authed) target = "/inside/gate";
  if (target === "/inside/gate" && authed) {
    target = safeInsideNext(request.nextUrl.searchParams.get("next")) ?? "/inside";
  }

  const url = request.nextUrl.clone();
  url.pathname = target;
  if (target === "/inside/gate" && !authed && requestedPortal && requestedPortal !== "/inside") {
    const next = safeInsideNext(requestedPortal);
    if (next) url.searchParams.set("next", next);
  }

  if (url.pathname === pathname && url.search === request.nextUrl.search) return NextResponse.next();
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
