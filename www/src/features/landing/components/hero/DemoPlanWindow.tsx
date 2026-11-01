import { CalendarCheck, Sparkles } from "lucide-react";
import { WindowFrame } from "@/components/ui/WindowFrame";
import { DEMO_PLAN_ROWS, DEMO_STEP } from "@/features/landing/data/heroDemo";
import { cn } from "@/lib/utils";

const ROW_DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:70ms]",
  "[animation-delay:140ms]",
  "[animation-delay:210ms]",
  "[animation-delay:280ms]",
  "[animation-delay:350ms]",
  "[animation-delay:420ms]",
];

const SKELETON_ROWS = ["w-3/4", "w-1/2", "w-2/3", "w-3/5", "w-1/2", "w-2/3", "w-2/5"];

function SkeletonRow({ width }: { width: string }) {
  return (
    <div className="flex h-11 items-center gap-3 rounded-xl px-3">
      <span className="h-3 w-7 rounded bg-sunken" />
      <span className={cn("h-3 animate-pulse rounded bg-sunken", width)} />
    </div>
  );
}

export function DemoPlanWindow({ step }: { step: number }) {
  const ready = step >= DEMO_STEP.ready;

  return (
    <WindowFrame title="FitX · This week" className="md:h-[540px]">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.01em]">Your week</p>
          <p className="text-xs text-muted">
            {ready ? "Home · bodyweight · 30 min" : "Waiting for your answers"}
          </p>
        </div>
        {ready && (
          <span className="flex shrink-0 animate-pop items-center gap-1.5 rounded-full border border-accent-edge/60 whitespace-nowrap bg-accent px-2.5 py-1 text-[11px] font-semibold">
            <Sparkles aria-hidden className="size-3" />
            Plan updated
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 p-2.5 sm:p-3">
        {ready
          ? DEMO_PLAN_ROWS.map((row, index) => (
              <div
                key={row.day}
                className={cn(
                  "flex h-11 animate-pop items-center gap-3 rounded-xl px-3",
                  ROW_DELAYS[index],
                  row.count > 0 ? "bg-surface hover:bg-sunken" : "bg-transparent",
                )}
              >
                <span className="w-7 font-mono text-[11px] text-subtle uppercase">{row.day}</span>
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-[13px]",
                    row.count > 0 ? "font-semibold text-ink" : "text-subtle",
                  )}
                >
                  {row.label}
                </span>
                {row.count > 0 && (
                  <span className="font-mono text-[11px] text-muted">{row.count} ex</span>
                )}
              </div>
            ))
          : SKELETON_ROWS.map((width, index) => <SkeletonRow key={index} width={width} />)}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-line px-4 py-3 text-xs text-muted sm:px-5">
        <CalendarCheck aria-hidden className="size-3.5 text-accent-edge" />
        {ready ? "16 exercises across 5 days" : "Building around you"}
      </div>
    </WindowFrame>
  );
}
