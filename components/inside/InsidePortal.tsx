"use client";

import { useEffect, useRef, useState } from "react";
import { InsideFooter } from "@/components/inside/InsideFooter";
import { InsideHeader } from "@/components/inside/InsideHeader";
import { LeadBoard } from "@/components/inside/LeadBoard";
import { LogLead } from "@/components/inside/LogLead";
import { OutreachPlaybook } from "@/components/inside/OutreachPlaybook";
import { WelcomeBanner } from "@/components/inside/WelcomeBanner";
import { WhatWeDo } from "@/components/inside/WhatWeDo";

export function InsidePortal({ signedInName }: { signedInName: string }) {
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

  return (
    <>
      <InsideHeader onNavigate={jump} />
      <main id="content">
        <WelcomeBanner signedInName={signedInName} />
        <LeadBoard />
        <WhatWeDo />
        <OutreachPlaybook />
        <LogLead signedInName={signedInName} />
      </main>
      <InsideFooter />
    </>
  );
}
