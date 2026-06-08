import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CUSTOM_ANSWER = "Something else";

export function QuickAnswers({
  answers,
  disabled,
  selectedAnswer,
  onSelect,
  onCustomAnswer,
}: {
  answers: string[];
  disabled: boolean;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
  onCustomAnswer: () => void;
}) {
  const options = [...answers, CUSTOM_ANSWER];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => {
        const selected =
          selectedAnswer === option ||
          (Boolean(selectedAnswer) &&
            !answers.includes(selectedAnswer!) &&
            option === CUSTOM_ANSWER);

        return (
          <Button
            key={option}
            type="button"
            variant={selected ? "default" : "outline"}
            size="sm"
            className={cn("rounded-full", selected && "pointer-events-none")}
            disabled={disabled || Boolean(selectedAnswer)}
            onClick={() =>
              option === CUSTOM_ANSWER ? onCustomAnswer() : onSelect(option)
            }
          >
            {selected && <Check className="size-3.5" />}
            {option}
          </Button>
        );
      })}

      {selectedAnswer && !answers.includes(selectedAnswer) && (
        <p className="w-full text-xs text-muted-foreground">
          Your answer:{" "}
          <span className="font-medium text-foreground">{selectedAnswer}</span>
        </p>
      )}
    </div>
  );
}
