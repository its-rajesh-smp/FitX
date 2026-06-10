import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/features/program/components/ExerciseCard";
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
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(
    null,
  );
  const toggleExercise = useToggleProgramExercise();
  const completed = day.exercises.filter(
    (exercise) => exercise.isCompleted,
  ).length;

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft /> Back to plan
      </Button>
      <header className="mt-5">
        <h1 className="text-2xl font-semibold tracking-tight">{day.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatWeekDay(day.dayNumber)} - {getProgramDayMuscles(day)} -{" "}
          {completed} / {day.exercises.length} completed
        </p>
      </header>
      {day.exercises.length ? (
        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-card">
          {day.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              expanded={expandedExerciseId === exercise.id}
              isPending={toggleExercise.isPending}
              onToggleExpanded={() =>
                setExpandedExerciseId((current) =>
                  current === exercise.id ? null : exercise.id,
                )
              }
              onToggleCompleted={() => toggleExercise.mutate(exercise.id)}
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

