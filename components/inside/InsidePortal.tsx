"use client";

import { useEffect, useRef, useState } from "react";
import { CompanyDesk } from "@/components/inside/CompanyDesk";
import { DealDesk } from "@/components/inside/DealDesk";
import { InsideFooter } from "@/components/inside/InsideFooter";
import { InsideHeader } from "@/components/inside/InsideHeader";
import { OutreachPlaybook } from "@/components/inside/OutreachPlaybook";
import { PricingDesk } from "@/components/inside/PricingDesk";
import { WelcomeBanner } from "@/components/inside/WelcomeBanner";
import { WhatWeDo } from "@/components/inside/WhatWeDo";
import type { DeskMode } from "@/components/inside/content";

export function InsidePortal({ signedInName }: { signedInName: string }) {
  const [mode, setMode] = useState<DeskMode>("sales");
  const [scrollTo, setScrollTo] = useState<{ id: string; nonce: number } | null>(null);
  const nonce = useRef(0);

  useEffect(() => {
    if (!scrollTo) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(scrollTo.id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [scrollTo]);

  function jump(id: string) {
    nonce.current += 1;
    setScrollTo({ id, nonce: nonce.current });
    const nextHash = id === "top" ? "" : `#${id}`;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
  }

  function navigate(id: string) {
    if (id === "deal-hub") {
      setMode("hq");
      jump("deal-hub");
      return;
    }
    if (id !== "top") setMode("sales");
    jump(id);
  }

  function selectMode(next: DeskMode) {
    setMode(next);
    jump(next === "hq" ? "deal-hub" : "workspace");
  }

  return (
    <>
      <InsideHeader onNavigate={navigate} />
      <main id="content">
        <WelcomeBanner mode={mode} onMode={selectMode} signedInName={signedInName} />
        <div id="workspace" role="tabpanel" aria-labelledby={`desk-tab-${mode}`}>
          <div className={mode === "sales" ? "block" : "hidden"}>
            <WhatWeDo />
            <PricingDesk />
            <OutreachPlaybook />
          </div>
          <div id="deal-hub" className="scroll-mt-32">
            <div className={mode === "hq" ? "block" : "hidden"}>
              <CompanyDesk onShowSales={() => selectMode("sales")} />
            </div>
            <DealDesk mode={mode} onShowHq={() => selectMode("hq")} />
          </div>
        </div>
      </main>
      <InsideFooter />
    </>
  );
}
