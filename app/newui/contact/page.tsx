import { AccessForm } from "@/components/newui/AccessForm";

export default function ContactPage() {
  return (
    <section className="nu-page flex min-h-[70vh] w-full flex-col justify-center py-20">
      <h1 className="text-[44px] leading-[1.05] md:text-[68px]">Write to us.</h1>
      <AccessForm />
    </section>
  );
}
