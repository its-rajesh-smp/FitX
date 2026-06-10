import { Circle, Dumbbell, LoaderCircle, X } from "lucide-react";
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
  const currentDayNumber = new Date().getDay();
  const days = [...plan.days].sort(
    (left, right) =>
      (left.dayNumber - currentDayNumber + 7) % 7 -
      (right.dayNumber - currentDayNumber + 7) % 7,
  );
  const today = days.find((day) => day.dayNumber === currentDayNumber);
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? null;
  const totalExercises = days.reduce((total, day) => total + day.exercises.length, 0);
  const completedExercises = days.reduce(
    (total, day) => total + day.exercises.filter((exercise) => exercise.isCompleted).length,
    0,
  );

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
        ) : selectedDay ? (
          <WorkoutDetail day={selectedDay} onBack={() => setSelectedDayId(null)} />
        ) : (
          <div className="mx-auto max-w-3xl">
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
                {days.map((day) => (
                  <button
                    type="button"
                    key={day.id}
                    onClick={() => setSelectedDayId(day.id)}
                    className={`flex w-full items-center gap-3 border-b px-4 py-4 text-left transition last:border-0 hover:bg-primary-soft/40 ${
                      day.id === today.id ? "bg-primary-soft/40" : ""
                    }`}
                  >
                    {day.id === today.id ? (
                      <span className="size-2.5 rounded-full bg-primary" />
                    ) : (
                      <Circle className="size-3.5 text-muted-foreground/50" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">{day.name}</p>
                        {day.id === today.id && <Badge className="px-2 py-0.5 text-[9px]">TODAY</Badge>}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{getProgramDayMuscles(day)}</p>
                    </div>
                    <div className="ml-auto shrink-0 text-right text-[11px] text-muted-foreground">
                      <p>{formatWeekDay(day.dayNumber)}</p>
                      <p>{day.exercises.length ? `${day.exercises.length} exercises` : "Rest day"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </aside>
  );
}
