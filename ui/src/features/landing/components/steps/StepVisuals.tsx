import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ABOUT_CHIPS = [
  { label: "Beginner", className: "group-hover:border-peach-edge group-hover:bg-peach-tint group-hover:text-peach-ink" },
  { label: "Full body", className: "group-hover:border-iris-edge group-hover:bg-iris-tint group-hover:text-iris-ink [transition-delay:60ms]" },
  { label: "Dumbbells", className: "group-hover:border-rose-edge group-hover:bg-rose-tint group-hover:text-rose-ink [transition-delay:120ms]" },
  { label: "30 min", className: "group-hover:border-accent-edge/60 group-hover:bg-accent [transition-delay:180ms]" },
];

/** Chips that light up, one by one, as the card is hovered. */
export function AboutYouVisual() {
  return (
    <div className="flex flex-wrap content-center justify-center gap-2 p-6">
      {ABOUT_CHIPS.map((chip) => (
        <span
          key={chip.label}
          className={cn(
            "rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted shadow-card transition-colors duration-300",
            chip.className,
          )}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

const WEEK_BARS = [
  { day: "M", height: "h-10 group-hover:h-14" },
  { day: "T", height: "h-7 group-hover:h-10" },
  { day: "W", height: "h-2" },
  { day: "T", height: "h-10 group-hover:h-14" },
  { day: "F", height: "h-8 group-hover:h-11" },
  { day: "S", height: "h-5 group-hover:h-7" },
  { day: "S", height: "h-2" },
];

/** A week of training load that grows on hover. */
export function WeekVisual() {
  return (
    <div className="flex items-end justify-center gap-2.5 px-6 pt-6 pb-5">
      {WEEK_BARS.map((bar, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <span
            className={cn(
              "w-5 rounded-md bg-iris-ink/25 transition-all duration-500 ease-calm group-hover:bg-iris-ink/70",
              bar.height,
            )}
          />
          <span className="font-mono text-[10px] text-subtle">{bar.day}</span>
        </div>
      ))}
    </div>
  );
}

const CHECK_ROWS = [
  { name: "Bodyweight Squat", delay: "" },
  { name: "Pushups", delay: "[transition-delay:120ms]" },
  { name: "Plank", delay: "[transition-delay:240ms]" },
];

/** Exercises that tick themselves off on hover. */
export function TrainVisual() {
  return (
    <div className="flex flex-col justify-center gap-1.5 p-5">
      {CHECK_ROWS.map((row) => (
        <div
          key={row.name}
          className="flex items-center gap-2.5 rounded-xl bg-surface px-3 py-2 shadow-card"
        >
          <span
            className={cn(
              "flex size-4.5 items-center justify-center rounded-full border border-line-strong text-transparent transition-colors duration-300 group-hover:border-accent-edge group-hover:bg-accent-edge group-hover:text-white",
              row.delay,
            )}
          >
            <Check aria-hidden className="size-3" strokeWidth={3} />
          </span>
          <span
            className={cn(
              "text-xs font-semibold transition-colors duration-300 group-hover:text-subtle",
              row.delay,
            )}
          >
            {row.name}
          </span>
        </div>
      ))}
    </div>
  );
}
