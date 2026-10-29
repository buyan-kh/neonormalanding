import { LockedRoom } from "@/components/newui/LockedRoom";
import { OpenRoom } from "@/components/newui/OpenRoom";
import { roomIsOpen } from "@/lib/newui-gate";

export default async function LabsPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const params = await searchParams;
  const open = await roomIsOpen(params.k, "/labs");
  return open ? <OpenRoom /> : <LockedRoom />;
}
