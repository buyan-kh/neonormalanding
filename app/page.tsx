import { DataPartners } from "@/components/DataPartners";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Refinery } from "@/components/Refinery";
import { RequestForm } from "@/components/RequestForm";
import { Scorecard } from "@/components/Scorecard";
import { TraceInspector } from "@/components/TraceInspector";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Refinery />
        <TraceInspector />
        <Scorecard />
        <DataPartners />
        <RequestForm />
      </main>
      <Footer />
    </>
  );
}
