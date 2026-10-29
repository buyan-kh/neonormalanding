import { DataPartners } from "@/components/DataPartners";
import { DeidSpecimen } from "@/components/DeidSpecimen";
import { Evaluation } from "@/components/Evaluation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Refinery } from "@/components/Refinery";
import { RequestForm } from "@/components/RequestForm";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="content">
        <Hero />
        <Refinery />
        <Evaluation />
        <DeidSpecimen />
        <DataPartners />
        <RequestForm />
      </main>
      <Footer />
    </>
  );
}
