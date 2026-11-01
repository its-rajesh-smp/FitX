import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToggleChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border pr-3 pl-2 text-[13px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-95",
        selected
          ? "border-ink bg-ink text-white"
          : "border-line bg-surface text-ink-soft shadow-card hover:border-line-strong",
      )}
    >
      <span className="relative size-3.5">
        <Plus
          aria-hidden
          className={cn(
            "absolute inset-0 size-3.5 transition-all duration-200",
            selected ? "scale-50 rotate-90 opacity-0" : "opacity-60",
          )}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className={cn(
            "absolute inset-0 size-3.5 text-accent transition-all duration-200",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
      </span>
      {label}
    </button>
  );
}
