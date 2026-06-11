import {
  CalendarDays,
  ChevronRight,
  History,
  Loader,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanShortcut({
  label,
  disabled,
  onOpen,
}: {
  label?: string;
  disabled?: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="border-primary/25 bg-primary-soft/30 shadow-card mt-4 rounded-2xl border p-3">
      <div className="flex items-center gap-3">
        <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-xl">
          <CalendarDays className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {label || "Your workout plan is ready"}
          </p>
          <p className="text-muted-foreground text-xs">
            View your schedule and exercises.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-3 w-full justify-between bg-white"
        disabled={disabled}
        onClick={onOpen}
      >
        <span className="flex items-center gap-2">See workout plan</span>
        {disabled ? <Loader className="animate-spin" /> : <ChevronRight />}
      </Button>
      <div className="mt-2 flex items-center justify-end gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled
          aria-label="Like workout plan"
          className="text-muted-foreground"
        >
          <ThumbsUp />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled
          aria-label="Dislike workout plan"
          className="text-muted-foreground"
        >
          <ThumbsDown />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled
          aria-label="View workout plan history"
          className="text-muted-foreground"
        >
          <History />
        </Button>
      </div>
    </div>
  );
}
