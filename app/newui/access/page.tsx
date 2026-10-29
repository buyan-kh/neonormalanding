import { AccessForm } from "@/components/newui/AccessForm";

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const params = await searchParams;
  return (
    <section className="nu-page w-full py-16 md:py-24">
      <h1 className="max-w-[12em] text-[44px] leading-[1.05] md:text-[64px]">Request access.</h1>
      <AccessForm preset={params.as} />
    </section>
  );
}
