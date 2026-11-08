import { Check, Play } from "lucide-react";
import type { PlanExercise } from "@/features/landing/data/plan";
import { cn } from "@/lib/utils";

export function ExerciseCheckRow({
  exercise,
  order,
  done,
  onToggle,
}: {
  exercise: PlanExercise;
  order: number;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="group flex animate-pop items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-2.5 shadow-card sm:px-4">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={`Mark ${exercise.name} as done`}
        onClick={onToggle}
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-200 active:scale-90",
          done ? "border-accent-edge bg-accent-edge text-white" : "border-line-strong hover:border-ink",
        )}
      >
        <Check
          aria-hidden
          strokeWidth={3}
          className={cn("size-3.5 transition-all duration-200", done ? "scale-100 opacity-100" : "scale-50 opacity-0")}
        />
      </button>

      <span className="hidden w-5 font-mono text-[11px] text-subtle sm:block">
        {String(order).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold transition-colors duration-200",
            done && "text-subtle line-through decoration-line-strong",
          )}
        >
          {exercise.name}
        </p>
        <p className="truncate text-xs text-muted">
          {exercise.muscle} · rest {exercise.rest}s
        </p>
      </div>

      <span className="font-mono text-xs text-ink-soft tabular-nums">
        {exercise.sets} × {exercise.reps}
      </span>

      <span
        aria-hidden
        className="hidden size-8 items-center justify-center rounded-full bg-sunken text-muted transition-colors group-hover:bg-ink group-hover:text-white sm:flex"
      >
        <Play className="ml-0.5 size-3.5 fill-current" />
      </span>
    </li>
  );
}
