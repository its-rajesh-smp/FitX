import { Check, Circle, Dumbbell, LoaderCircle, Moon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkoutDetail } from "@/features/program/components/WorkoutDetail";
import {
  formatWeekDay,
  getProgramDayMuscles,
} from "@/features/program/helpers/program";
import type { ProgramPlan } from "@/features/program/types/program";

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
  const currentDayNumber = (new Date().getDay() || 7) as ProgramPlan["planDays"][number]["dayNumber"];
  const days = [...plan.planDays].sort(
    (left, right) =>
      (left.dayNumber - currentDayNumber + 7) % 7 -
      (right.dayNumber - currentDayNumber + 7) % 7,
  );
  const today = days.find((day) => day.dayNumber === currentDayNumber);
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? null;
  const totalExercises = days.reduce((total, day) => total + day.userExercises.length, 0);
  const completedExercises = days.reduce(
    (total, day) => total + day.userExercises.filter((exercise) => exercise.isCompleted).length,
    0,
  );
  const getDayProgress = (day: (typeof days)[number]) => {
    const completed = day.userExercises.filter((exercise) => exercise.isCompleted).length;

    return {
      completed,
      isComplete: day.userExercises.length > 0 && completed === day.userExercises.length,
    };
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedDayId]);

  return (
    <aside className="relative flex h-full min-h-0 flex-col bg-canvas">
      {isUpdating && (
        <div className="absolute inset-x-0 bottom-0 top-14 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-card">
            <LoaderCircle className="size-4 animate-spin text-primary" />
            Updating workout plan...
          </div>
        </div>
      )}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4">
        <div>
          <h2 className="text-sm font-bold">Workout Planner</h2>
          <p className="text-[11px] text-muted-foreground">Your workout plan</p>
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close workout planner">
            <X />
          </Button>
        )}
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {!today ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm rounded-2xl border bg-white p-8 text-center shadow-card">
              <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Dumbbell className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">No workout plan yet</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ask FitX to create a plan. It will appear here as soon as it is ready.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto min-w-0 max-w-3xl">
            <section className="mb-6 min-w-0">
              <div className="mb-3 flex min-w-0 items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold">This week</h2>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    Stay consistent, one workout at a time.
                  </p>
                </div>
                <p className="shrink-0 text-xs font-medium text-muted-foreground">
                  {days.filter((day) => getDayProgress(day).isComplete).length} workouts done
                </p>
              </div>
              <div className="w-full min-w-0 overflow-x-auto p-1">
                <div className="grid min-w-[620px] grid-cols-7 gap-2">
                  {days.map((day) => {
                    const { completed, isComplete } = getDayProgress(day);
                    const isToday = day.id === today.id;
                    const isSelected = day.id === selectedDayId;

                    return (
                      <button
                        type="button"
                        key={day.id}
                        onClick={() => setSelectedDayId(day.id)}
                        aria-label={`Open ${formatWeekDay(day.dayNumber)} workout`}
                        aria-pressed={isSelected}
                        className={`rounded-xl border px-2 py-3 text-center transition hover:-translate-y-0.5 hover:shadow-sm ${
                          isComplete
                            ? "border-green-200 bg-green-50 hover:bg-green-100"
                            : isToday
                              ? "border-primary/30 bg-primary-soft/60"
                              : "bg-white hover:bg-muted/50"
                        } ${isSelected ? "ring-2 ring-inset ring-primary/40" : ""}`}
                      >
                        <span
                          className={`block text-[10px] font-semibold uppercase tracking-wide ${
                            isComplete ? "text-green-700" : isToday ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {isToday ? "Today" : formatWeekDay(day.dayNumber).slice(0, 3)}
                        </span>
                        <span
                          className={`mx-auto mt-2 flex size-8 items-center justify-center rounded-full text-xs font-semibold ${
                            isComplete
                              ? "bg-green-600 text-white"
                              : isToday
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isComplete ? (
                            <Check className="size-4" />
                          ) : day.userExercises.length > 0 ? (
                            <Dumbbell className="size-4" />
                          ) : (
                            <Moon className="size-4" />
                          )}
                        </span>
                        <span className="mt-2 block truncate text-[11px] font-medium">
                          {day.label}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">
                          {day.userExercises.length
                            ? `${completed}/${day.userExercises.length} done`
                            : "Rest day"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
            {selectedDay ? (
              <WorkoutDetail day={selectedDay} onBack={() => setSelectedDayId(null)} />
            ) : (
              <>
                <section className="mb-5">
                  <h1 className="text-2xl font-semibold tracking-tight">Your {days.length} day exercise plan</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {completedExercises} / {totalExercises} exercises completed
                  </p>
                  <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">
                    Repeat this 7-day routine for 4 weeks to build consistency and
                    track your progress.
                  </p>
                </section>
                <section>
                  <div className="overflow-hidden rounded-2xl border bg-white shadow-card">
                    {days.map((day) => {
                      const { isComplete } = getDayProgress(day);

                      return (
                        <button
                          type="button"
                          key={day.id}
                          onClick={() => setSelectedDayId(day.id)}
                          className={`flex w-full items-center gap-3 border-b px-4 py-4 text-left transition last:border-0 ${
                            isComplete
                              ? "bg-green-50 hover:bg-green-100"
                              : day.id === today.id
                                ? "bg-primary-soft/40 hover:bg-primary-soft/60"
                                : "hover:bg-primary-soft/40"
                          }`}
                        >
                          {isComplete ? (
                            <span className="flex size-4 items-center justify-center rounded-full bg-green-600 text-white">
                              <Check className="size-2.5" />
                            </span>
                          ) : day.id === today.id ? (
                            <span className="size-2.5 rounded-full bg-primary" />
                          ) : (
                            <Circle className="size-3.5 text-muted-foreground/50" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold">{day.label}</p>
                              {day.id === today.id && <Badge className="px-2 py-0.5 text-[9px]">TODAY</Badge>}
                            </div>
                            <p className="truncate text-xs text-muted-foreground">{getProgramDayMuscles(day)}</p>
                          </div>
                          <div className="ml-auto shrink-0 text-right text-[11px] text-muted-foreground">
                            <p>{formatWeekDay(day.dayNumber)}</p>
                            <p>{day.userExercises.length ? `${day.userExercises.length} exercises` : "Rest day"}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
