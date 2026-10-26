import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Grain } from "@/components/Grain";
import { CONTACT_EMAIL } from "@/lib/contact";
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
    "RL evaluation tasks and verifiable environments for science. Deterministic Harbor and Docker environments with Python verifiers.",
  authors: [{ name: "Neo Norma", url: `mailto:${CONTACT_EMAIL}` }],
  other: {
    contact: CONTACT_EMAIL,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={ibm.variable}>
      <body className="bg-white font-mono text-[#0A0A0A] antialiased">
        <Grain />
        <a
          href="#pipeline"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-[#0A0A0A] focus:px-3 focus:py-2 focus:text-white"
        >
          Skip to pipeline
        </a>
        {children}
      </body>
    </html>
  );
}
