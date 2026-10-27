export function WelcomeBanner({ signedInName }: { signedInName: string }) {
  return (
    <section id="top" className="mx-auto w-full max-w-[1080px] scroll-mt-32 px-4 pb-8 pt-8 md:px-6 md:pt-9">
      <p className="text-[11px] tracking-[0.16em] text-[#5A5852]">INSIDE // GTM & OUTREACH WORKSPACE</p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-[#0A0A0A]">{`[SIGNED IN: ${signedInName.toUpperCase()}]`}</p>
      <h1 className="mt-4 max-w-[22em] text-[26px] leading-[1.2] text-[#0A0A0A] md:text-[32px]">
        Neo Norma&apos;s go-to-market desk for outbound sales.
      </h1>
      <p className="mt-4 max-w-[62ch] text-[13px] leading-relaxed text-[#5A5852] md:text-sm">
        Tugi and Buyan run the list from here. Track every target lab and data partner, grab a script, and keep the
        product in plain English.
      </p>
    </section>
  );
}
