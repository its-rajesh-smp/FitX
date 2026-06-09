import { Check, ChevronDown, Dumbbell } from "lucide-react";
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
  expanded,
  isPending,
  onToggleExpanded,
  onToggleCompleted,
}: {
  exercise: ProgramExercise;
  expanded: boolean;
  isPending: boolean;
  onToggleExpanded: () => void;
  onToggleCompleted: () => void;
}) {
  return (
    <article className={cn("border-b last:border-b-0", exercise.isCompleted && "bg-success-soft/30")}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggleExpanded}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-primary-soft/30"
      >
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border text-white",
            exercise.isCompleted ? "border-success bg-success" : "border-muted-foreground/40",
          )}
        >
          {exercise.isCompleted && <Check className="size-3" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{exercise.exercise.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{exercise.exercise.primaryMuscles.join(", ") || "Full body"}</span>
            <span className="font-medium text-foreground">
              {exercise.sets ?? "-"} sets x {exercise.reps ?? "-"} reps
            </span>
            <span>{exercise.rest ? `${exercise.rest}s rest` : "Rest as needed"}</span>
          </div>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="space-y-4 border-t bg-muted/20 px-4 py-4 pl-12">
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn(
                "border bg-white capitalize",
                difficultyStyles[exercise.exercise.level as keyof typeof difficultyStyles],
              )}
            >
              {exercise.exercise.level ?? "All levels"}
            </Badge>
            <Badge className="bg-muted text-muted-foreground">
              <Dumbbell className="mr-1 size-3" />
              {exercise.exercise.equipment ?? "Body only"}
            </Badge>
          </div>

          {exercise.exercise.instructions.length > 0 && (
            <ol className="list-decimal space-y-1 pl-4 text-xs leading-5 text-muted-foreground">
              {exercise.exercise.instructions.map((instruction, index) => (
                <li key={`${exercise.id}-${index}`}>{instruction}</li>
              ))}
            </ol>
          )}

          <Button
            variant={exercise.isCompleted ? "secondary" : "default"}
            disabled={isPending}
            onClick={onToggleCompleted}
          >
            {exercise.isCompleted ? "Mark as not done" : "Mark as done"}
          </Button>
        </div>
      )}
    </article>
  );
}
