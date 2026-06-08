import { ChevronDown, Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@/features/program/data/program";
import { cn } from "@/lib/utils";

const difficultyStyles = {
  Beginner: "border-emerald-300 bg-emerald-50 text-emerald-700",
  Intermediate: "border-amber-300 bg-amber-50 text-amber-700",
  Advanced: "border-rose-300 bg-rose-50 text-rose-700",
};

export function ExerciseCard({
  exercise,
  done,
  onToggle,
}: {
  exercise: Exercise;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={cn("rounded-xl border bg-white p-5 shadow-card transition", done && "border-l-4 border-l-success")}>
      <h2 className="text-base font-extrabold">{exercise.name}</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge>{exercise.muscle}</Badge>
        <Badge className={cn("border bg-transparent", difficultyStyles[exercise.difficulty])}>{exercise.difficulty}</Badge>
        <Badge className="bg-muted text-muted-foreground"><Dumbbell className="mr-1 size-3" />{exercise.equipment}</Badge>
      </div>
      <div className="mt-4 flex gap-6 text-sm">
        <span className="font-bold">{exercise.sets}</span>
        <span className="text-muted-foreground">{exercise.rest}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{exercise.note}</p>
      <button className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
        How to do this <ChevronDown className="size-3" />
      </button>
      <Button
        className={cn("mt-5 h-10 w-full rounded-lg", done && "bg-success-soft text-success hover:bg-success-soft/80")}
        onClick={onToggle}
      >
        {done ? "Done ✓" : "Mark as Done"}
      </Button>
    </article>
  );
}
