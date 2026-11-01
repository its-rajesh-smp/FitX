import { ArrowLeft, ArrowRight, CalendarCheck, RotateCcw } from "lucide-react";
import { ThinkingDots } from "@/components/ui/ThinkingDots";
import { ToggleChip } from "@/components/ui/ToggleChip";
import { MUSCLE_CHOICES, TIME_CHOICES, type Muscle } from "@/features/landing/data/landing";
import { cn } from "@/lib/utils";

const PILL = "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-[background-color,color,transform] duration-200 active:scale-95";

function ContinueButton({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(PILL, "group bg-ink text-white hover:bg-ink-soft disabled:bg-line disabled:text-subtle")}
    >
      Continue
      <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(PILL, "group text-muted hover:bg-sunken hover:text-ink")}>
      <ArrowLeft aria-hidden className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      Back
    </button>
  );
}

export function MuscleStep({
  selected,
  onToggle,
  onContinue,
}: {
  selected: ReadonlySet<Muscle>;
  onToggle: (muscle: Muscle) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <p className="text-xs font-semibold text-muted">Which muscles do you want to focus on?</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {MUSCLE_CHOICES.map((muscle) => (
          <ToggleChip
            key={muscle}
            label={muscle}
            selected={selected.has(muscle)}
            onToggle={() => onToggle(muscle)}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p aria-live="polite" className="font-mono text-xs text-muted tabular-nums">
          {selected.size} selected
        </p>
        <ContinueButton disabled={selected.size === 0} onClick={onContinue} />
      </div>
    </>
  );
}

export function TimeStep({
  time,
  onSelect,
  onBack,
  onContinue,
}: {
  time: string;
  onSelect: (time: (typeof TIME_CHOICES)[number]) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <p className="text-xs font-semibold text-muted">How long can you train each day?</p>
      <div role="radiogroup" aria-label="Time per day" className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {TIME_CHOICES.map((choice) => (
          <button
            key={choice}
            type="button"
            role="radio"
            aria-checked={time === choice}
            onClick={() => onSelect(choice)}
            className={cn(
              "h-14 rounded-2xl border font-mono text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-95",
              time === choice
                ? "border-accent-edge/70 bg-accent text-ink"
                : "border-line bg-surface text-ink-soft shadow-card hover:border-line-strong",
            )}
          >
            {choice}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <BackButton onClick={onBack} />
        <ContinueButton onClick={onContinue} />
      </div>
    </>
  );
}

export function BuildingStep() {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-xs font-semibold text-muted">
        <ThinkingDots />
        Building your week
      </p>
      {["w-3/4", "w-1/2", "w-2/3"].map((width) => (
        <div key={width} className="flex h-11 items-center gap-3 rounded-xl bg-surface px-3 shadow-card">
          <span className="h-3 w-7 rounded bg-sunken" />
          <span className={cn("h-3 animate-pulse rounded bg-sunken", width)} />
        </div>
      ))}
    </div>
  );
}

const ROW_DELAYS = ["", "[animation-delay:80ms]", "[animation-delay:160ms]"];

export function ReadyStep({
  rows,
  extra,
  onStartOver,
}: {
  rows: { day: string; label: string; detail: string }[];
  extra: number;
  onStartOver: () => void;
}) {
  return (
    <>
      <p className="flex items-center gap-2 text-xs font-semibold text-ink">
        <CalendarCheck aria-hidden className="size-3.5 text-accent-edge" />
        Your week is ready
      </p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {rows.map((row, index) => (
          <li
            key={row.day}
            className={cn("flex animate-pop items-center gap-3 rounded-xl bg-surface px-3 py-2 shadow-card", ROW_DELAYS[index])}
          >
            <span className="w-8 font-mono text-[11px] text-subtle uppercase">{row.day}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">{row.label}</p>
              <p className="truncate text-[11px] text-muted">{row.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted">{extra > 0 ? `+${extra} more in your plan` : "Ready to start"}</p>
        <button type="button" onClick={onStartOver} className={cn(PILL, "group text-muted hover:bg-sunken hover:text-ink")}>
          <RotateCcw aria-hidden className="size-3.5 transition-transform duration-300 group-hover:-rotate-45" />
          Start over
        </button>
      </div>
    </>
  );
}
