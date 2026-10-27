import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { INSIDE_COOKIE, readSessionToken } from "@/lib/inside-auth";

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
  if (isPortalPath(target) && !authed) target = "/inside/gate";
  if (target === "/inside/gate" && authed) target = "/inside";
  if (target === pathname) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
