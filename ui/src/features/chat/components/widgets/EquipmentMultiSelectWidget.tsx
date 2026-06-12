import { Building2, Check, House } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EQUIPMENT_TARGETS,
  type EquipmentTarget,
} from "@/features/chat/constants/equipmentTargets";
import { EXERCISE_EQUIPMENT } from "@/features/chat/constants/exerciseFilters";
import { cn } from "@/lib/utils";

const TARGET_DETAILS = {
  "Gym Access": {
    description: "Use the full range of gym equipment and machines.",
    Icon: Building2,
  },
  "Workout At Home": {
    description: "Start with workouts that need no equipment.",
    Icon: House,
  },
} as const;

export function EquipmentMultiSelectWidget({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (values: string[]) => void;
}) {
  const [selectedTarget, setSelectedTarget] = useState<EquipmentTarget | null>(
    null,
  );
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [showAllEquipment, setShowAllEquipment] = useState(false);

  const selectTarget = (target: EquipmentTarget) => {
    setSelectedTarget(target);
    setSelectedEquipment([...EQUIPMENT_TARGETS[target]]);
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedTarget(null);
    setSelectedEquipment((current) =>
      current.includes(equipment)
        ? current.filter((item) => item !== equipment)
        : [...current, equipment],
    );
  };

  const submit = () => {
    if (selectedTarget) {
      onSubmit([
        `${selectedTarget} - ${EQUIPMENT_TARGETS[selectedTarget].join(", ")}`,
      ]);
      return;
    }

    onSubmit(selectedEquipment);
  };

  return (
    <div className="bg-card shadow-card mt-3 rounded-2xl border p-3 sm:p-4">
      <div className="grid gap-2">
        {(Object.keys(EQUIPMENT_TARGETS) as EquipmentTarget[]).map((target) => {
          const isSelected = selectedTarget === target;
          const { description, Icon } = TARGET_DETAILS[target];

          return (
            <Button
              key={target}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-pressed={isSelected}
              className={cn(
                "h-auto min-h-16 justify-start gap-3 rounded-xl px-3 py-3 text-left whitespace-normal",
                isSelected &&
                  "border-primary bg-primary-soft text-primary hover:bg-primary-soft",
              )}
              onClick={() => selectTarget(target)}
            >
              <span
                className={cn(
                  "bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg",
                  isSelected && "bg-primary text-white",
                )}
              >
                <Icon className="size-4.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-5 font-semibold">
                  {target}
                </span>
                <span
                  className={cn(
                    "text-muted-foreground mt-0.5 block text-xs leading-4 font-normal",
                    isSelected && "text-primary/75",
                  )}
                >
                  {description}
                </span>
              </span>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected && "border-primary bg-primary text-white",
                )}
              >
                {isSelected && <Check className="size-3" />}
              </span>
            </Button>
          );
        })}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={showAllEquipment}
        disabled={disabled}
        className="bg-muted hover:bg-muted/70 mt-3 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:opacity-50"
        onClick={() => setShowAllEquipment((current) => !current)}
      >
        <span>
          Choose specific equipment
          <span className="text-muted-foreground ml-1 text-xs font-normal">
            for full control
          </span>
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "bg-muted-foreground/30 relative ml-3 h-5 w-9 shrink-0 rounded-full transition-colors",
            showAllEquipment && "bg-primary",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
              showAllEquipment && "translate-x-4",
            )}
          />
        </span>
      </button>

      {showAllEquipment && (
        <div className="mt-3 flex flex-wrap gap-2">
          {EXERCISE_EQUIPMENT.map((equipment) => {
            const isSelected = selectedEquipment.includes(equipment);
            return (
              <Button
                key={equipment}
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-full capitalize",
                  isSelected && "border-primary bg-primary-soft text-primary",
                )}
                onClick={() => toggleEquipment(equipment)}
              >
                {isSelected && <Check className="size-3.5" />}
                {equipment}
              </Button>
            );
          })}
        </div>
      )}

      <Button
        type="button"
        size="sm"
        className="mt-3 w-full sm:w-auto"
        disabled={disabled || selectedEquipment.length === 0}
        onClick={submit}
      >
        Continue
      </Button>
    </div>
  );
}
