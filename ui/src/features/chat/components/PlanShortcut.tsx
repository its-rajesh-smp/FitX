import { CalendarDays, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanShortcut({
  label,
  onOpen,
}: {
  label?: string;
  onOpen: () => void;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-primary/25 bg-primary-soft/30 p-3 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <CalendarDays className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {label || "Your workout plan is ready"}
          </p>
          <p className="text-xs text-muted-foreground">
            View your schedule and exercises.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-3 w-full justify-between bg-white"
        onClick={onOpen}
      >
        See plan <ChevronRight />
      </Button>
    </div>
  );
}
