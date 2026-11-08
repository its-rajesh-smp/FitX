import {
  ArrowRight,
  CalendarDays,
  History,
  Loader,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Not wired up yet; shown disabled as placeholders.
const FEEDBACK_ACTIONS = [
  { label: "Like workout plan", Icon: ThumbsUp },
  { label: "Dislike workout plan", Icon: ThumbsDown },
  { label: "View workout plan history", Icon: History },
];

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
    <div className="border-violet-edge bg-violet-tint mt-4 overflow-hidden rounded-2xl border">
      <div className="flex items-center gap-3 p-4">
        <span className="text-violet-ink shadow-card flex size-10 shrink-0 items-center justify-center rounded-xl bg-white">
          <CalendarDays className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-5 font-semibold">
            {label || "Your workout plan is ready"}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[13px] leading-5">
            Your week, exercises and progress.
          </p>
        </div>
      </div>
      <div className="border-violet-edge flex items-center justify-between gap-2 border-t bg-white/70 px-3 py-2.5">
        <div className="flex items-center">
          {FEEDBACK_ACTIONS.map(({ label: actionLabel, Icon }) => (
            <Button
              key={actionLabel}
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label={actionLabel}
              className="text-muted-foreground"
            >
              <Icon />
            </Button>
          ))}
        </div>
        <Button className="h-8 px-4 text-[13px]" disabled={disabled} onClick={onOpen}>
          Open plan
          {disabled ? (
            <Loader className="animate-spin" />
          ) : (
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
