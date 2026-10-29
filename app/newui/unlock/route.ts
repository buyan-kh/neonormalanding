import { NextResponse } from "next/server";

const ALLOWED = new Set(["/labs", "/holders"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") ?? "/labs";
  const dest = ALLOWED.has(next) ? next : "/labs";
  const key = process.env.NEWUI_ACCESS_KEY ?? "";
  const given = url.searchParams.get("k") ?? "";
  const response = NextResponse.redirect(new URL(dest, url));
  if (key && given === key) {
    response.cookies.set("newui_access", key, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}
