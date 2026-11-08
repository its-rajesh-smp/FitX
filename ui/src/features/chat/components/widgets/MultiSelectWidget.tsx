import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WIDGET_CHIP_CLASS,
  WIDGET_CHIP_SELECTED_CLASS,
} from "@/features/chat/constants/widgetTones";
import { cn } from "@/lib/utils";

export function MultiSelectWidget({
  options,
  exclusiveOptions = [],
  disabled,
  onSubmit,
}: {
  options: readonly string[];
  exclusiveOptions?: readonly string[];
  disabled: boolean;
  onSubmit: (values: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((current) => {
      if (current.includes(option)) {
        return current.filter((item) => item !== option);
      }
      if (exclusiveOptions.includes(option)) return [option];

      return [
        ...current.filter((item) => !exclusiveOptions.includes(item)),
        option,
      ];
    });
  };

  return (
    <div className="mt-4 rounded-2xl border bg-white p-3 sm:p-4">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <Button
              key={option}
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                WIDGET_CHIP_CLASS,
                isSelected && WIDGET_CHIP_SELECTED_CLASS,
              )}
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => toggle(option)}
            >
              {isSelected && <Check className="size-3.5" />}
              {option}
            </Button>
          );
        })}
      </div>
      <Button
        type="button"
        className="mt-4 h-9 px-5 text-[13px]"
        disabled={disabled || selected.length === 0}
        onClick={() => onSubmit(selected)}
      >
        Continue
      </Button>
    </div>
  );
}
