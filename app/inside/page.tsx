import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LoginGate } from "@/components/inside/LoginGate";
import { INSIDE_COOKIE, readSessionToken } from "@/lib/inside-auth";

export const metadata: Metadata = {
  title: "Neo Norma // Inside",
  description: "Sign in to the Neo Norma inside desk.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InsidePage() {
  const jar = await cookies();
  const session = readSessionToken(jar.get(INSIDE_COOKIE)?.value);
  if (!session) return <LoginGate />;

  const { InsidePortal } = await import("@/components/inside/InsidePortal");
  return <InsidePortal signedInName={session.name} />;
}
