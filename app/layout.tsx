import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas — The talent layer for global clinical trials",
  description: "Moneyball for clinical trial investigators. Natural-language search over 2M+ investigators across ClinicalTrials.gov, PubMed, NPI, and FDA databases.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%", margin: 0 }}>{children}</body>
    </html>
  );
}
