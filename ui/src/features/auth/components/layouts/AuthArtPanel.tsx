import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { AUTH_SLIDE_INTERVAL_MS, AUTH_SLIDES } from "@/features/auth/data/authSlides";
import { cn } from "@/lib/utils";

export function AuthArtPanel({ wordmark }: { wordmark: ReactNode }) {
  const slides = AUTH_SLIDES;
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const slide = slides[active];

  // Restarts on every change, so a manual pick also gets a full interval.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(
      () => setActive((index) => (index + 1) % slides.length),
      AUTH_SLIDE_INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, slides.length]);

  return (
    // Text colours are hard-coded so the panel stays light whatever the app theme.
    <aside
      aria-roledescription="carousel"
      aria-label="What FitX does"
      className="relative hidden overflow-hidden text-stone-900 transition-[background-color] duration-1000 lg:block"
      style={{ backgroundColor: slide.sky }}
    >
      {/* Short screens tighten the copy so it stays on flat sky. */}
      <div className="relative z-10 px-12 pt-[60px] [@media(max-height:760px)]:pt-10">
        {wordmark}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <figure className="mt-12 max-w-[540px] [@media(max-height:760px)]:mt-8">
              <blockquote className="text-[22px] leading-[1.45] font-medium tracking-[-0.02em] text-balance">
                {slide.statement}
              </blockquote>
              <figcaption className="mt-3 text-[15px] text-stone-600">{slide.attribution}</figcaption>
            </figure>

            <div aria-hidden className="my-9 h-px w-16 bg-stone-900/15 [@media(max-height:760px)]:my-6" />

            <ul className="flex max-w-[430px] flex-col gap-4 [@media(max-height:760px)]:gap-3">
              {slide.lines.map((line) => (
                <li key={line} className="text-[15px] leading-relaxed text-stone-600 even:pl-6">
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Wide strips pinned to the bottom at natural height, cross-faded, never cover-cropped. */}
      {slides.map((item, index) => (
        <img
          key={item.image}
          src={item.image}
          alt=""
          fetchPriority={index === 0 ? "high" : "low"}
          draggable={false}
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full transition-opacity duration-1000 select-none",
            index === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {/* Dots; the active one stretches into a pill that fills until the next slide. */}
      <div className="absolute bottom-7 left-12 z-10 flex items-center gap-1.5 rounded-full bg-white/55 px-2.5 py-2 backdrop-blur-sm">
        {slides.map((item, index) => {
          const isActive = index === active;
          return (
            <button
              key={item.image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show slide ${index + 1} of ${slides.length}`}
              aria-current={isActive}
              className={cn(
                "relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300",
                isActive ? "w-6 bg-stone-900/20" : "w-1.5 bg-stone-900/30 hover:bg-stone-900/50",
              )}
            >
              {isActive && (
                <motion.span
                  key={active}
                  className="absolute inset-y-0 left-0 rounded-full bg-stone-900/80"
                  initial={{ width: reduceMotion ? "100%" : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: reduceMotion ? 0 : AUTH_SLIDE_INTERVAL_MS / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
