import { Moon, PartyPopper } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressRing } from "@/features/landing/components/ui/ProgressRing";
import { DayTabs } from "@/features/landing/components/week/DayTabs";
import { ExerciseCheckRow } from "@/features/landing/components/week/ExerciseCheckRow";
import { SAMPLE_WEEK } from "@/features/landing/data/plan";
import { useToggleSet } from "@/features/landing/hooks/useToggleSet";

export function WeekPlanner() {
  const [dayIndex, setDayIndex] = useState(0);
  const { selected: done, toggle } = useToggleSet<string>(["mon-1"]);

  const day = SAMPLE_WEEK[dayIndex];
  const doneToday = day.exercises.filter((exercise) =>
    done.has(exercise.id),
  ).length;
  const isRest = day.exercises.length === 0;

  const completedDays = useMemo(
    () =>
      new Set(
        SAMPLE_WEEK.flatMap((planDay, index) =>
          planDay.exercises.length > 0 &&
          planDay.exercises.every((exercise) => done.has(exercise.id))
            ? [index]
            : [],
        ),
      ),
    [done],
  );

  return (
    <div className="rounded-[28px] border border-white/80 bg-surface/90 p-3 shadow-float backdrop-blur-xl sm:p-5">
      <DayTabs
        days={SAMPLE_WEEK}
        activeIndex={dayIndex}
        completedDays={completedDays}
        onSelect={setDayIndex}
      />

      <div className="flex items-center justify-between gap-4 px-2 pt-6 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-wide text-subtle uppercase">
            Day {dayIndex + 1}
          </p>
          <p className="truncate text-2xl font-medium tracking-[-0.03em]">
            {day.label}
          </p>
        </div>
        {/* Keep the ring's space on rest days so the header height never changes. */}
        <div className="size-14 shrink-0">
          {!isRest && (
            <ProgressRing done={doneToday} total={day.exercises.length} />
          )}
        </div>
      </div>

      {/* Fixed height fits the longest day (4 exercises), so switching days never resizes the card. */}
      <div className="h-[264px]">
        {isRest ? (
          <div
            key={day.short}
            className="flex h-full animate-pop flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-strong text-center"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-surface text-iris-ink shadow-card">
              <Moon aria-hidden className="size-4.5" />
            </span>
            <p className="text-sm font-semibold">Rest day</p>
            <p className="max-w-60 text-sm text-muted">
              Recovery is part of the plan. Take a walk and sleep well.
            </p>
          </div>
        ) : (
          <ul key={day.short} className="flex flex-col gap-2">
            {day.exercises.map((exercise, index) => (
              <ExerciseCheckRow
                key={exercise.id}
                exercise={exercise}
                order={index + 1}
                done={done.has(exercise.id)}
                onToggle={() => toggle(exercise.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <p
        aria-live="polite"
        className="flex h-10 items-center justify-center gap-2 pt-3 text-sm text-muted"
      >
        {!isRest && doneToday === day.exercises.length ? (
          <span className="flex animate-pop items-center gap-2 font-semibold text-ink">
            <PartyPopper aria-hidden className="size-4 text-accent-edge" />
            Day complete. Nice work.
          </span>
        ) : (
          !isRest && "Tap the circles to tick off exercises"
        )}
      </p>
    </div>
  );
}
