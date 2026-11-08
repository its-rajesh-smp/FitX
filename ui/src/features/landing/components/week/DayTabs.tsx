import { motion } from "motion/react";
import type { PlanDay } from "@/features/landing/data/plan";
import { cn } from "@/lib/utils";

export function DayTabs({
  days,
  activeIndex,
  completedDays,
  onSelect,
}: {
  days: PlanDay[];
  activeIndex: number;
  completedDays: ReadonlySet<number>;
  onSelect: (index: number) => void;
}) {
  return (
    <div role="tablist" aria-label="Days of the week" className="grid grid-cols-7 gap-0.5 rounded-full border border-line bg-surface p-1.5">
      {days.map((day, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={day.short}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(index)}
            className={cn(
              "relative flex h-9 flex-col items-center justify-center rounded-full text-xs font-semibold transition-colors",
              active ? "text-white" : "text-muted hover:bg-sunken hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId="day-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 42 }}
              />
            )}
            <span className="relative">{day.short}</span>
            <span
              className={cn(
                "absolute bottom-1 size-1 rounded-full transition-all duration-300",
                completedDays.has(index) ? "scale-100 bg-accent-edge" : "scale-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
