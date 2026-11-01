"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS, SITE } from "@/constants/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export function SiteNav() {
  const active = useActiveSection(SECTION_IDS);
  const scrolled = useScrolled();

  return (
    <header className="pointer-events-none sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "pointer-events-auto mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full border border-line bg-surface/75 pr-2 pl-5 backdrop-blur-xl transition-shadow duration-300",
          scrolled ? "shadow-float" : "shadow-card",
        )}
      >
        <a href="#top" aria-label="FitX home" className="flex items-center">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id} className="relative">
              {active === link.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full border border-accent-edge/50 bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 40 }}
                />
              )}
              <a
                href={`#${link.id}`}
                className={cn(
                  "relative flex h-8 items-center rounded-full px-3.5 text-[13px] font-semibold transition-colors",
                  active === link.id ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ButtonLink href={SITE.signUpUrl} size="sm" withArrow>
          Get started
        </ButtonLink>
      </nav>
    </header>
  );
}
