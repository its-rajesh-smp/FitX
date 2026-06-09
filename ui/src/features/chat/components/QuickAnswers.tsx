import { Button } from "@/components/ui/button";

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

  if (selectedAnswer) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={disabled}
            onClick={() =>
              option === CUSTOM_ANSWER ? onCustomAnswer() : onSelect(option)
            }
          >
            {option}
          </Button>
      ))}
    </div>
  );
}
