import { DataPartners } from "@/components/DataPartners";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { RequestForm } from "@/components/RequestForm";
import { Scorecard } from "@/components/Scorecard";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Scorecard />
        <DataPartners />
        <RequestForm />
      </main>
      <Footer />
    </>
  );
}
