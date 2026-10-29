import type { Metadata } from "next";
import { MarketplaceCatalog } from "@/components/newui/MarketplaceCatalog";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "A catalog of Neo Norma environments.",
  robots: { index: false, follow: false },
};

export default function MarketplacePage() {
  return (
    <div className="nu-page py-12 md:py-16">
      <p className="nu-label">Marketplace</p>
      <h1 className="mt-6 max-w-[12em] text-[40px] leading-[1.05] md:text-[64px]">A catalog of environments.</h1>
      <p className="mt-6 max-w-[28em] text-[22px] italic leading-snug md:text-[28px]">
        Each open room is settled by a Grader, and opened only after Preflight verification.
      </p>
      <MarketplaceCatalog />
    </div>
  );
}
