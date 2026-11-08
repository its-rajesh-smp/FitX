import { useEffect } from "react";
import { SiteFooter } from "@/features/landing/components/layouts/SiteFooter";
import { SiteNav } from "@/features/landing/components/layouts/SiteNav";
import { ClosingCta } from "@/features/landing/components/ClosingCta";
import { FactsRow } from "@/features/landing/components/FactsRow";
import { Faq } from "@/features/landing/components/Faq";
import { Features } from "@/features/landing/components/features/Features";
import { Hero } from "@/features/landing/components/hero/Hero";
import { HowItWorks } from "@/features/landing/components/steps/HowItWorks";
import { YourWeek } from "@/features/landing/components/week/YourWeek";

const LANDING_TITLE = "FitX: your personal trainer, in a chat";

export function LandingPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = LANDING_TITLE;
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    // `.site` scopes the site palette and fonts so they don't leak into the app.
    <div className="site min-h-screen">
      <SiteNav />
      <main className="-mt-[68px] sm:-mt-[72px]">
        <Hero />
        <FactsRow />
        <HowItWorks />
        <Features />
        <YourWeek />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
