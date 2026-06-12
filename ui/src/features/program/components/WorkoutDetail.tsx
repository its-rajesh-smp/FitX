import { ArrowLeft } from "lucide-react";
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
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft /> Back to plan
      </Button>
      <header className="mt-5">
        <h1 className="text-2xl font-semibold tracking-tight">{day.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatWeekDay(day.dayNumber)} - {getProgramDayMuscles(day)} -{" "}
          {completed} / {day.userExercises.length} completed
        </p>
      </header>
      {day.userExercises.length ? (
        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-card">
          {day.userExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onSelect={() => setSelectedExerciseId(exercise.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border bg-white p-8 text-center text-sm text-muted-foreground">
          This is a rest and recovery day.
        </div>
      )}
    </div>
  );
}
