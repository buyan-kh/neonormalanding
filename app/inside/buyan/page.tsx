import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LoginGate } from "@/components/inside/LoginGate";
import { INSIDE_COOKIE, readSessionToken } from "@/lib/inside-auth";

export const metadata: Metadata = {
  title: "Neo Norma // Command Center",
  description: "Inside command center for Neo Norma HQ, prototypes, the catalog, buyer rooms, market radar, and the seed desk.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BuyanPage() {
  const jar = await cookies();
  const session = readSessionToken(jar.get(INSIDE_COOKIE)?.value);
  if (!session) return <LoginGate />;

  const { BuyanCommand } = await import("@/components/inside/BuyanCommand");
  return <BuyanCommand signedInName={session.name} />;
}
