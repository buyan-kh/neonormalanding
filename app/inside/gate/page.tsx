import type { Metadata } from "next";
import { LoginGate } from "@/components/inside/LoginGate";
import { safeInsideNext } from "@/lib/inside-auth";

export const metadata: Metadata = {
  title: "Neo Norma // Inside",
  description: "Sign in to the Neo Norma inside desk.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InsideGatePage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string; next?: string }>;
}) {
  const params = await searchParams;
  return <LoginGate denied={params.denied === "1"} nextPath={safeInsideNext(params.next)} />;
}
