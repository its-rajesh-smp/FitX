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

  if (selectedAnswer) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((option) => {
        const isCustom = option === CUSTOM_ANSWER;
        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => (isCustom ? onCustomAnswer() : onSelect(option))}
            className={cn(
              "hover:border-accent-edge/60 hover:bg-violet-tint h-8 rounded-full border bg-white px-3.5 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
              isCustom
                ? "text-muted-foreground border-dashed border-input"
                : "border-input text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
