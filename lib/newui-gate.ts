import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function roomIsOpen(queryKey: string | undefined, nextPath: "/labs" | "/holders") {
  const key = process.env.NEWUI_ACCESS_KEY ?? "";
  if (!key) return false;
  const jar = await cookies();
  if (queryKey && queryKey === key && jar.get("newui_access")?.value !== key) {
    redirect(`/unlock?k=${encodeURIComponent(queryKey)}&next=${nextPath}`);
  }
  return queryKey === key || jar.get("newui_access")?.value === key;
}
