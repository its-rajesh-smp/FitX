import { ChevronDown, Dumbbell, Target } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ChatExercise } from "@/features/chat/types/chat";
import { cn } from "@/lib/utils";

const levelStyles: Record<string, string> = {
  beginner: "border-emerald-300 bg-emerald-50 text-emerald-700",
  intermediate: "border-amber-300 bg-amber-50 text-amber-700",
  expert: "border-rose-300 bg-rose-50 text-rose-700",
};

export function ChatExerciseCards({ exercises }: { exercises: ChatExercise[] }) {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border bg-white">
      {exercises.map((exercise) => (
        <ChatExerciseCard
          key={exercise.id}
          exercise={exercise}
          expanded={expandedExerciseId === exercise.id}
          onToggle={() =>
            setExpandedExerciseId((current) =>
              current === exercise.id ? null : exercise.id,
            )
          }
        />
      ))}
    </div>
  );
}

function ChatExerciseCard({
  exercise,
  expanded,
  onToggle,
}: {
  exercise: ChatExercise;
  expanded: boolean;
  onToggle: () => void;
}) {
  const muscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];

  return (
    <article className="border-b last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-primary-soft/30"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{exercise.name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
          {exercise.primaryMuscles.map((muscle) => (
            <Badge key={muscle} className="px-2 py-0.5 text-[10px]">
              <Target className="mr-1 size-2.5" />
              {muscle}
            </Badge>
          ))}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="space-y-3 border-t bg-muted/20 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "border bg-white capitalize",
                exercise.level && levelStyles[exercise.level.toLowerCase()],
              )}
            >
              {exercise.level ?? "Any level"}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
              <Dumbbell className="size-3.5 text-primary" />
              {exercise.equipment ?? "No equipment"}
            </span>
          </div>
          <p className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-foreground">
            {exercise.recommendation}
          </p>
          {exercise.instructions.length > 0 && (
            <ol className="list-decimal space-y-1 pl-4 text-xs leading-5 text-muted-foreground">
              {exercise.instructions.map((instruction, index) => (
                <li key={`${exercise.id}-${index}`}>{instruction}</li>
              ))}
            </ol>
          )}
          {muscles.length > exercise.primaryMuscles.length && (
            <p className="text-[11px] text-muted-foreground">
              Also works: {exercise.secondaryMuscles.join(", ")}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
