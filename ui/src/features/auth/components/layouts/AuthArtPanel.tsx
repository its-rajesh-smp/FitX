import type { ReactNode } from "react";
import artImage from "@/assets/auth/auth-lake.webp";

/** Sampled from the artwork's top edge so the painting melts into the panel. */
const ART_SKY = "#f3eff7";

// Product truths from the landing copy, not testimonials.
const STATEMENT =
  "Tell FitX your goal, your gear and your time. Get a week of training you can change just by asking.";
const ATTRIBUTION = "What FitX does, in two sentences";
const LINES = [
  "No forms, no long quizzes. A few taps in the chat and your plan is ready.",
  "Moved a workout or missing a dumbbell? Say so, and your week adjusts.",
];

export function AuthArtPanel({ wordmark }: { wordmark: ReactNode }) {
  return (
    // Text colours are hard-coded so the panel stays light whatever the app theme.
    <aside
      className="relative hidden overflow-hidden text-stone-900 lg:block"
      style={{ backgroundColor: ART_SKY }}
    >
      <div className="relative z-10 px-12 pt-[60px] [@media(max-height:760px)]:pt-10">
        {wordmark}

        <figure className="mt-12 max-w-[540px] [@media(max-height:760px)]:mt-8">
          <blockquote className="text-[22px] leading-[1.45] font-medium tracking-[-0.02em] text-balance">
            {STATEMENT}
          </blockquote>
          <figcaption className="mt-3 text-[15px] text-stone-600">
            {ATTRIBUTION}
          </figcaption>
        </figure>

        <div aria-hidden className="my-9 h-px w-16 bg-stone-900/15 [@media(max-height:760px)]:my-6" />

        <ul className="flex max-w-[430px] flex-col gap-4 [@media(max-height:760px)]:gap-3">
          {LINES.map((line) => (
            <li key={line} className="text-[15px] leading-relaxed text-stone-600 even:pl-6">
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Short screens tighten the copy above so it stays on flat sky. */}
      {/* A wide strip pinned to the bottom at natural height, never cover-cropped. */}
      <img
        src={artImage}
        alt=""
        fetchPriority="high"
        draggable={false}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full select-none"
      />
    </aside>
  );
}
