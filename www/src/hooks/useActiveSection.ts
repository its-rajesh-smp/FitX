"use client";

import { useEffect, useState } from "react";

/** Tracks which section id is currently in the middle band of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    sections.forEach((section) => observer.observe(section));

    const clearAtTop = () => {
      if (window.scrollY < 200) setActive(null);
    };
    window.addEventListener("scroll", clearAtTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", clearAtTop);
    };
  }, [ids]);

  return active;
}
