import { motion } from "motion/react";
import { Check, ChevronRight, Dumbbell, LoaderCircle, Moon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkoutDetail } from "@/features/program/components/WorkoutDetail";
import {
  formatWeekDay,
  getProgramDayMuscles,
} from "@/features/program/helpers/program";
import type { ProgramDay, ProgramPlan } from "@/features/program/types/program";
import { cn } from "@/lib/utils";

const getDayProgress = (day: ProgramDay) => {
  const completed = day.userExercises.filter((exercise) => exercise.isCompleted).length;
  const total = day.userExercises.length;
  return { completed, total, isRest: total === 0, isComplete: total > 0 && completed === total };
};

const shortDay = (day: ProgramDay) => formatWeekDay(day.dayNumber).slice(0, 3);

function DayGlyph({ day }: { day: ProgramDay }) {
  const { isRest, isComplete } = getDayProgress(day);
  return (
    <span
      className={cn(
        "flex size-7 items-center justify-center rounded-full",
        isComplete && "bg-accent-edge text-white",
        !isComplete && !isRest && "bg-violet-tint text-violet-ink",
        isRest && "bg-secondary text-subtle",
      )}
    >
      {isComplete ? (
        <Check className="size-3.5" strokeWidth={2.5} />
      ) : isRest ? (
        <Moon className="size-3.5" />
      ) : (
        <Dumbbell className="size-3.5 rotate-45" />
      )}
    </span>
  );
}

function TodayChip() {
  return (
    <span className="border-accent-edge/50 bg-accent shrink-0 rounded-full border px-2 py-px text-[10px] font-semibold">
      Today
    </span>
  );
}

export function WorkoutPlannerPanel({
  plan,
  onClose,
  isUpdating = false,
  showCloseButton = true,
}: {
  plan: ProgramPlan;
  onClose: () => void;
  isUpdating?: boolean;
  showCloseButton?: boolean;
}) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentDayNumber = (new Date().getDay() ||
    7) as ProgramPlan["planDays"][number]["dayNumber"];
  // The week starts from today.
  const days = [...plan.planDays].sort(
    (left, right) =>
      ((left.dayNumber - currentDayNumber + 7) % 7) -
      ((right.dayNumber - currentDayNumber + 7) % 7),
  );
  const today = days.find((day) => day.dayNumber === currentDayNumber);
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? null;
  const progress = days.map(getDayProgress);
  const totalExercises = progress.reduce((sum, day) => sum + day.total, 0);
  const completedExercises = progress.reduce((sum, day) => sum + day.completed, 0);
  const workoutDays = progress.filter((day) => !day.isRest).length;
  const percentDone = totalExercises ? (completedExercises / totalExercises) * 100 : 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedDayId]);

  return (
    <aside className="bg-canvas relative flex h-full min-h-0 flex-col">
      {isUpdating && (
        <div className="absolute inset-x-0 top-14 bottom-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="shadow-card flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[13px] font-medium">
            <LoaderCircle className="text-accent-edge size-4 animate-spin" />
            Updating your plan...
          </div>
        </div>
      )}

      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-white px-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-[15px] leading-5 font-semibold">Your week</h2>
          <p className="text-muted-foreground text-[12px] leading-4">Workout planner</p>
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close workout planner">
            <X />
          </Button>
        )}
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {!today ? (
          <div className="flex h-full items-center justify-center">
            <div className="shadow-card max-w-sm rounded-[28px] border bg-white p-8 text-center">
              <span className="bg-violet-tint text-violet-ink mx-auto flex size-11 items-center justify-center rounded-2xl">
                <Dumbbell className="size-5 rotate-45" />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">No workout plan yet</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Ask FitX to create a plan. It will appear here as soon as it is ready.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl min-w-0">
            <section>
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-[26px] leading-tight font-normal tracking-[-0.03em] text-balance">
                    {workoutDays} {workoutDays === 1 ? "workout" : "workouts"} this week
                  </h1>
                  <p className="text-muted-foreground mt-1 text-[13px] text-pretty">
                    Repeat this week for 4 weeks to build consistency.
                  </p>
                </div>
                <p className="text-muted-foreground shrink-0 font-mono text-[13px]">
                  <span className="text-foreground">{completedExercises}</span>/{totalExercises} done
                </p>
              </div>
              <div
                className="bg-secondary mt-4 h-1.5 overflow-hidden rounded-full"
                role="progressbar"
                aria-label="Exercises completed this week"
                aria-valuemin={0}
                aria-valuemax={totalExercises}
                aria-valuenow={completedExercises}
              >
                <motion.div
                  className="bg-accent-edge h-full rounded-full"
                  initial={false}
                  animate={{ width: `${percentDone}%` }}
                  transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                />
              </div>
            </section>

            <div className="mt-6 grid grid-cols-7 gap-1.5">
              {days.map((day) => {
                const { completed, total, isRest } = getDayProgress(day);
                const isToday = day.id === today.id;
                const isSelected = day.id === selectedDayId;

                return (
                  <button
                    type="button"
                    key={day.id}
                    onClick={() => setSelectedDayId(day.id)}
                    aria-label={`Open ${formatWeekDay(day.dayNumber)}: ${day.label}`}
                    aria-pressed={isSelected}
                    className={cn(
                      "hover:border-accent-edge/50 flex min-w-0 flex-col items-center gap-2 rounded-xl border bg-white px-1 py-2.5 transition-colors",
                      isToday && "border-accent-edge/60 bg-accent/45",
                      isSelected && "ring-accent-edge/50 ring-offset-canvas ring-2 ring-offset-1",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-[0.08em] uppercase",
                        isToday ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {isToday ? "Today" : shortDay(day)}
                    </span>
                    <DayGlyph day={day} />
                    <span className="text-muted-foreground font-mono text-[11px]">
                      {isRest ? "Rest" : `${completed}/${total}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedDay ? (
              <div className="mt-6">
                <WorkoutDetail day={selectedDay} onBack={() => setSelectedDayId(null)} />
              </div>
            ) : (
              <section className="shadow-card mt-6 overflow-hidden rounded-2xl border bg-white">
                {days.map((day) => {
                  const { completed, total, isRest, isComplete } = getDayProgress(day);
                  const isToday = day.id === today.id;

                  return (
                    <button
                      type="button"
                      key={day.id}
                      onClick={() => setSelectedDayId(day.id)}
                      className={cn(
                        "group hover:bg-violet-tint/50 flex w-full items-center gap-4 border-b px-4 py-3.5 text-left transition-colors last:border-0 sm:px-5",
                        isToday && "bg-violet-tint/40",
                      )}
                    >
                      <span className="text-muted-foreground w-9 shrink-0 font-mono text-[11px] tracking-[0.08em] uppercase">
                        {shortDay(day)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("truncate text-[14px] font-semibold", isRest && "text-muted-foreground")}>
                            {day.label}
                          </p>
                          {isToday && <TodayChip />}
                        </div>
                        <p className="text-muted-foreground mt-0.5 truncate text-[12px] first-letter:uppercase">
                          {getProgramDayMuscles(day)}
                        </p>
                      </div>
                      {isComplete ? (
                        <span className="bg-accent-edge flex size-5 shrink-0 items-center justify-center rounded-full text-white">
                          <Check className="size-3" strokeWidth={2.5} />
                        </span>
                      ) : (
                        <span className="text-muted-foreground shrink-0 font-mono text-[12px]">
                          {isRest ? "Rest" : `${completed}/${total}`}
                        </span>
                      )}
                      <ChevronRight className="text-subtle size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  );
                })}
              </section>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
