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
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {exercises.map((exercise) => (
        <ChatExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}

function ChatExerciseCard({ exercise }: { exercise: ChatExercise }) {
  const [expanded, setExpanded] = useState(false);
  const muscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];

  return (
    <article className="shadow-card overflow-hidden rounded-xl border bg-white">
      <div className="border-b bg-primary-soft/40 p-4">
        <h3 className="leading-tight font-extrabold">{exercise.name}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {exercise.primaryMuscles.map((muscle) => (
            <Badge key={muscle}>
              <Target className="mr-1 size-3" />
              {muscle}
            </Badge>
          ))}
          <Badge
            className={cn(
              "border bg-white capitalize",
              exercise.level && levelStyles[exercise.level.toLowerCase()],
            )}
          >
            {exercise.level ?? "Any level"}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Dumbbell className="size-3.5 text-primary" />
          <span className="capitalize">{exercise.equipment ?? "No equipment"}</span>
        </div>
        <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm font-bold text-foreground">
          {exercise.recommendation}
        </p>

        <button
          type="button"
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          How to do it
          <ChevronDown
            className={cn("size-3.5 transition-transform", expanded && "rotate-180")}
          />
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            <ol className="list-decimal space-y-1 pl-4 text-xs leading-5 text-muted-foreground">
              {exercise.instructions.map((instruction, index) => (
                <li key={`${exercise.id}-${index}`}>{instruction}</li>
              ))}
            </ol>
            {muscles.length > exercise.primaryMuscles.length && (
              <p className="text-[11px] text-muted-foreground">
                Also works: {exercise.secondaryMuscles.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
