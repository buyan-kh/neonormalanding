import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { Shell } from "@/components/newui/Shell";
import "./newui.css";

const news = Newsreader({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-news",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neo Norma",
  description: "A new standard for intelligence.",
  robots: { index: false, follow: false },
};

export default function NewuiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`newui ${news.variable}`}>
      <Shell>{children}</Shell>
    </div>
  );
}
