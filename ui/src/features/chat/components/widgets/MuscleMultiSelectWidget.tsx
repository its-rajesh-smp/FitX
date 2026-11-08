import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MuscleBodyMap } from "@/features/chat/components/widgets/MuscleBodyMap";
import { EXERCISE_MUSCLES } from "@/features/chat/constants/exerciseFilters";
import {
  WORKOUT_TARGETS,
  type WorkoutTarget,
} from "@/features/chat/constants/workoutTargets";
import {
  WIDGET_CHIP_CLASS,
  WIDGET_CHIP_SELECTED_CLASS,
} from "@/features/chat/constants/widgetTones";
import { cn } from "@/lib/utils";

export function MuscleMultiSelectWidget({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (values: string[]) => void;
}) {
  const [selectedTarget, setSelectedTarget] = useState<WorkoutTarget | null>(
    null,
  );
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [showAllMuscles, setShowAllMuscles] = useState(false);
  const highlightedMuscles = selectedTarget
    ? WORKOUT_TARGETS[selectedTarget]
    : selectedMuscles;

  const selectTarget = (target: WorkoutTarget) => {
    setSelectedTarget(target);
    setSelectedMuscles([...WORKOUT_TARGETS[target]]);
  };

  const toggleMuscle = (muscle: string) => {
    setSelectedTarget(null);
    setSelectedMuscles((current) =>
      current.includes(muscle)
        ? current.filter((item) => item !== muscle)
        : [...current, muscle],
    );
  };

  const submit = () => {
    if (selectedTarget) {
      onSubmit([
        `${selectedTarget} - ${WORKOUT_TARGETS[selectedTarget].join(", ")}`,
      ]);
      return;
    }

    onSubmit(selectedMuscles);
  };

  return (
    <div className="mt-4 rounded-2xl border bg-white p-3 sm:p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="grid gap-2">
          {(Object.keys(WORKOUT_TARGETS) as WorkoutTarget[]).map((target) => {
            const isSelected = selectedTarget === target;
            return (
              <Button
                key={target}
                type="button"
                variant="outline"
                disabled={disabled}
                aria-pressed={isSelected}
                className={cn(
                  "hover:border-accent-edge/50 hover:bg-violet-tint/50 h-auto min-h-11 justify-start rounded-2xl border-border bg-white px-3 py-2.5",
                  isSelected &&
                    "border-accent-edge bg-accent hover:bg-accent text-foreground",
                )}
                onClick={() => selectTarget(target)}
              >
                <span
                  className={cn(
                    "mr-2 flex size-5 items-center justify-center rounded-full border",
                    isSelected && "border-accent-edge bg-accent-edge text-white",
                  )}
                >
                  {isSelected && <Check className="size-3" />}
                </span>
                {target} Workout
              </Button>
            );
          })}
        </div>
        <MuscleBodyMap selected={highlightedMuscles} />
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={showAllMuscles}
        disabled={disabled}
        className="bg-secondary hover:bg-violet-tint mt-3 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors disabled:opacity-50"
        onClick={() => setShowAllMuscles((current) => !current)}
      >
        <span>
          Show all body parts
          <span className="text-muted-foreground ml-1 text-xs font-normal">
            for full control
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "bg-muted-foreground/30 relative ml-3 h-5 w-9 shrink-0 rounded-full transition-colors",
            showAllMuscles && "bg-accent-edge",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
              showAllMuscles && "translate-x-4",
            )}
          />
        </span>
      </button>

      {showAllMuscles && (
        <div className="mt-3 flex flex-wrap gap-2">
          {EXERCISE_MUSCLES.map((muscle) => {
            const isSelected = selectedMuscles.includes(muscle);
            return (
              <Button
                key={muscle}
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                aria-pressed={isSelected}
                className={cn(
                  WIDGET_CHIP_CLASS,
                  isSelected && WIDGET_CHIP_SELECTED_CLASS,
                )}
                onClick={() => toggleMuscle(muscle)}
              >
                {isSelected && <Check className="size-3.5" />}
                {muscle}
              </Button>
            );
          })}
        </div>
      )}

      <Button
        type="button"
        className="mt-4 h-9 w-full px-5 text-[13px] sm:w-auto"
        disabled={disabled || (!selectedTarget && selectedMuscles.length === 0)}
        onClick={submit}
      >
        Continue
      </Button>
    </div>
  );
}
