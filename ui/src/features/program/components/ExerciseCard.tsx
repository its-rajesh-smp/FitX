import { ChevronDown, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProgramExercise } from "@/features/program/types/program";
import { cn } from "@/lib/utils";

const difficultyStyles = {
  beginner: "border-emerald-300 bg-emerald-50 text-emerald-700",
  intermediate: "border-amber-300 bg-amber-50 text-amber-700",
  expert: "border-rose-300 bg-rose-50 text-rose-700",
};

export function ExerciseCard({
  exercise,
  done,
  onToggle,
}: {
  exercise: ProgramExercise;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={cn(
        "shadow-card rounded-xl border bg-white p-5 transition",
        done && "border-l-success border-l-4",
      )}
    >
      <h2 className="text-base font-extrabold">{exercise.exercise.name}</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge>{exercise.exercise.primaryMuscles[0] ?? "Full body"}</Badge>
        <Badge
          className={cn(
            "border bg-transparent",
            difficultyStyles[
              exercise.exercise.level as keyof typeof difficultyStyles
            ],
          )}
        >
          {exercise.exercise.level ?? "All levels"}
        </Badge>
        <Badge className="bg-muted text-muted-foreground">
          <Dumbbell className="mr-1 size-3" />
          {exercise.exercise.equipment ?? "Body only"}
        </Badge>
      </div>
      <div className="mt-4 flex gap-6 text-sm">
        <span className="font-bold">
          {exercise.sets ?? "-"} sets x {exercise.reps ?? "-"} reps
        </span>
        <span className="text-muted-foreground">
          {exercise.rest ? `${exercise.rest}s rest` : "Rest as needed"}
        </span>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        {exercise.exercise.instructions[0] ?? "Focus on controlled form."}
      </p>
      <button className="text-primary mt-4 flex items-center gap-1 text-sm font-semibold">
        How to do this <ChevronDown className="size-3" />
      </button>
      <Button
        className={cn(
          "mt-5 h-10 w-full rounded-lg",
          done && "bg-success-soft text-success hover:bg-success-soft/80",
        )}
        onClick={onToggle}
      >
        {done ? "Done ✓" : "Mark as Done"}
      </Button>
    </article>
  );
}
