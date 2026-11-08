import lakeImage from "@/assets/landing/lake.webp";
import { TileHeading } from "@/features/landing/components/features/TileHeading";
import {
  BuildingStep,
  MuscleStep,
  ReadyStep,
  TimeStep,
} from "@/features/landing/components/features/setup/SetupSteps";
import { PREVIEW_DAYS } from "@/features/landing/data/landing";
import { useSetupDemo, type SetupStep } from "@/features/landing/hooks/useSetupDemo";
import { cn } from "@/lib/utils";

const STEP_INDEX: Record<SetupStep, number> = { muscles: 1, time: 2, building: 3, ready: 3 };

const STEP_CELL = "col-start-1 row-start-1 flex flex-col justify-between";
const NOOP = () => {};
const SIZER_ROWS = PREVIEW_DAYS.map((day) => ({
  day,
  label: "Quadriceps focus",
  detail: "Romanian Deadlift · 60 min",
}));

function StepSizer({ children }: { children: React.ReactNode }) {
  return (
    <div aria-hidden inert className={cn(STEP_CELL, "invisible")}>
      {children}
    </div>
  );
}

export function SetupTile({ className }: { className?: string }) {
  const { step, setStep, selected, toggle, time, setTime, preview, startOver } = useSetupDemo();
  const index = STEP_INDEX[step];

  return (
    <div className={cn("relative flex flex-col gap-6 overflow-hidden rounded-[28px] border border-line p-6 shadow-card sm:p-7", className)}>
      <img
        src={lakeImage}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-white/50 via-white/10 to-transparent" />

      <div className="relative">
        <TileHeading
          tone="violet"
          lead="Tap,"
          rest="don't type"
          text="FitX asks its setup questions with simple pickers right in the chat. Try it."
        />
      </div>

      <div className="relative mt-auto rounded-[20px] border border-white/70 bg-surface/85 p-3 shadow-float backdrop-blur-xl sm:p-4">
        <div className="mb-3 flex items-center gap-2">
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={cn(
                "h-1 rounded-full transition-all duration-500 ease-calm",
                dot <= index ? "w-6 bg-accent-edge" : "w-3 bg-line",
              )}
            />
          ))}
          <span className="ml-auto font-mono text-[11px] text-subtle">Step {index} of 3</span>
        </div>

        {/* Every step is stacked invisibly in one cell, so the panel always fits the tallest step. */}
        <div className="grid">
          <StepSizer>
            <MuscleStep selected={selected} onToggle={toggle} onContinue={NOOP} />
          </StepSizer>
          <StepSizer>
            <TimeStep time={time} onSelect={NOOP} onBack={NOOP} onContinue={NOOP} />
          </StepSizer>
          <StepSizer>
            <ReadyStep rows={SIZER_ROWS} extra={1} onStartOver={NOOP} />
          </StepSizer>

          <div key={step} className={cn(STEP_CELL, "animate-pop")}>
            {step === "muscles" && (
              <MuscleStep selected={selected} onToggle={toggle} onContinue={() => setStep("time")} />
            )}
            {step === "time" && (
              <TimeStep
                time={time}
                onSelect={setTime}
                onBack={() => setStep("muscles")}
                onContinue={() => setStep("building")}
              />
            )}
            {step === "building" && <BuildingStep />}
            {step === "ready" && (
              <ReadyStep rows={preview.rows} extra={preview.extra} onStartOver={startOver} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
