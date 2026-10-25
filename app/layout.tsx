import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Grain } from "@/components/Grain";
import "./globals.css";

const ibm = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neo Norma",
  description:
    "Verifiable RL environments for clinical oncology, genomics, and wet-lab biology. Harbor and Docker native, with deterministic Python verifiers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={ibm.variable}>
      <body className="bg-[#070707] font-mono text-[#EFECE6] antialiased">
        <Grain />
        <a
          href="#pipeline"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-[#EFECE6] focus:px-3 focus:py-2 focus:text-[#070707]"
        >
          Skip to pipeline
        </a>
        {children}
      </body>
    </html>
  );
}
