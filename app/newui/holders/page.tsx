import { LockedRoom } from "@/components/newui/LockedRoom";
import { OpenRoom } from "@/components/newui/OpenRoom";
import { roomIsOpen } from "@/lib/newui-gate";

export default async function HoldersPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const params = await searchParams;
  const open = await roomIsOpen(params.k, "/newui/holders");
  return open ? <OpenRoom /> : <LockedRoom />;
}