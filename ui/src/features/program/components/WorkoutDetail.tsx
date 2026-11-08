import { ArrowLeft, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ExerciseCard,
  ExerciseDetail,
} from "@/features/program/components/ExerciseCard";
import {
  formatWeekDay,
  getProgramDayMuscles,
} from "@/features/program/helpers/program";
import { useToggleProgramExercise } from "@/features/program/hooks/useToggleProgramExercise";
import type { ProgramDay } from "@/features/program/types/program";

export function WorkoutDetail({
  day,
  onBack,
}: {
  day: ProgramDay;
  onBack: () => void;
}) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );
  const topRef = useRef<HTMLDivElement>(null);
  const toggleExercise = useToggleProgramExercise();
  const selectedExercise =
    day.userExercises.find((exercise) => exercise.id === selectedExerciseId) ??
    null;
  const completed = day.userExercises.filter(
    (exercise) => exercise.isCompleted,
  ).length;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedExerciseId]);

  if (selectedExercise) {
    return (
      <div ref={topRef} className="mx-auto max-w-3xl">
        <ExerciseDetail
          exercise={selectedExercise}
          isPending={toggleExercise.isPending}
          onBack={() => setSelectedExerciseId(null)}
          onToggleCompleted={() => toggleExercise.mutate(selectedExercise.id)}
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="mx-auto max-w-3xl">
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground -ml-2 h-8 px-2.5 text-[13px]"
        onClick={onBack}
      >
        <ArrowLeft /> Back to week
      </Button>
      <header className="mt-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.08em] uppercase">
            {formatWeekDay(day.dayNumber)}
          </p>
          <h1 className="mt-1 text-[26px] leading-tight font-normal tracking-[-0.03em] text-balance">
            {day.label}
          </h1>
          <p className="text-muted-foreground mt-1 truncate text-[13px] first-letter:uppercase">
            {getProgramDayMuscles(day)}
          </p>
        </div>
        {day.userExercises.length > 0 && (
          <p className="text-muted-foreground shrink-0 font-mono text-[13px]">
            <span className="text-foreground">{completed}</span>/{day.userExercises.length} done
          </p>
        )}
      </header>
      {day.userExercises.length ? (
        <div className="shadow-card mt-5 overflow-hidden rounded-2xl border bg-white">
          {day.userExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={() => setSelectedExerciseId(exercise.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground mt-5 flex flex-col items-center gap-3 rounded-2xl border bg-white p-8 text-center text-sm">
          <span className="bg-secondary text-subtle flex size-10 items-center justify-center rounded-full">
            <Moon className="size-4.5" />
          </span>
          A rest and recovery day. Sleep well and stay hydrated.
        </div>
      )}
    </div>
  );
}
