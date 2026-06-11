import { Check, ChevronDown, Dumbbell, Play, Timer } from "lucide-react";
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
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${exercise.exercise.name} exercise tutorial`,
  )}`;

  return (
    <article
      className={cn(
        "border-b transition-colors last:border-b-0",
        expanded && "bg-primary-soft/15",
        exercise.isCompleted && "bg-success-soft/30",
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggleExpanded}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-primary-soft/30 sm:px-5"
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-white transition",
            exercise.isCompleted
              ? "border-success bg-success"
              : "border-muted-foreground/30 bg-white",
          )}
        >
          {exercise.isCompleted && <Check className="size-3" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold sm:text-[15px]">
            {exercise.exercise.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="capitalize">
              {exercise.exercise.primaryMuscles.join(", ") || "Full body"}
            </span>
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Dumbbell className="size-3" />
              {exercise.sets ?? "-"} sets x {exercise.reps ?? "-"} reps
            </span>
            <span className="flex items-center gap-1">
              <Timer className="size-3" />
              {exercise.rest ? `${exercise.rest}s rest` : "Rest as needed"}
            </span>
          </div>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/70">
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </span>
      </button>

      {expanded && (
        <div className="border-t bg-white/70 px-4 py-5 sm:px-5">
          <div className="flex flex-wrap gap-2">
            <Badge
              className={cn(
                "border bg-white capitalize",
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

          {exercise.exercise.instructions.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                  How to perform
                </h4>
                <a
                  href={youtubeSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-red-600"
                >
                  <Play className="size-3 fill-red-600 text-red-600" />
                  Video guide
                </a>
              </div>
              <ol className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
                {exercise.exercise.instructions.map((instruction, index) => (
                  <li key={`${exercise.id}-${index}`} className="flex gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4">
            <Button
              variant={exercise.isCompleted ? "secondary" : "default"}
              disabled={isPending}
              onClick={onToggleCompleted}
            >
              <Check />
              {exercise.isCompleted ? "Mark as not done" : "Mark as done"}
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
