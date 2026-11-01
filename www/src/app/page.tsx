import { SiteFooter } from "@/components/layouts/SiteFooter";
import { SiteNav } from "@/components/layouts/SiteNav";
import { ClosingCta } from "@/features/landing/components/ClosingCta";
import { FactsRow } from "@/features/landing/components/FactsRow";
import { Faq } from "@/features/landing/components/Faq";
import { Features } from "@/features/landing/components/features/Features";
import { Hero } from "@/features/landing/components/hero/Hero";
import { HowItWorks } from "@/features/landing/components/steps/HowItWorks";
import { YourWeek } from "@/features/landing/components/week/YourWeek";

export default function Home() {
  return (
    <>
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
    </>
  );
}
