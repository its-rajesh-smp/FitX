import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import {
  FeaturesSection,
  HeroSection,
  HighlightsSection,
  HowItWorksSection,
  StartSection,
} from "@/features/landing/components/LandingSections";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function LandingPage() {
  const isAuthenticated = Boolean(useAuthStore((state) => state.token));
  const primaryHref = isAuthenticated ? "/chat" : "/register";

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <LandingHeader isAuthenticated={isAuthenticated} primaryHref={primaryHref} />
      <HeroSection isAuthenticated={isAuthenticated} primaryHref={primaryHref} />
      <HighlightsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StartSection isAuthenticated={isAuthenticated} primaryHref={primaryHref} />
      <LandingFooter />
    </main>
  );
}
