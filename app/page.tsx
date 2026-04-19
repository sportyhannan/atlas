import { CTA } from "@/components/landing/cta";
import { DataSources } from "@/components/landing/data-sources";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navigation } from "@/components/landing/navigation";
import { ProblemStats } from "@/components/landing/problem-stats";
import { RisingStars } from "@/components/landing/rising-stars";
import { ROICalculator } from "@/components/landing/roi-calculator";
import { Scoring } from "@/components/landing/scoring";
import { Solution } from "@/components/landing/solution";

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProblemStats />
        <Solution />
        <Scoring />
        <DataSources />
        <RisingStars />
        <ROICalculator />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
