import { ArrowUp, Check, Dumbbell } from "lucide-react";
import { ThinkingDots } from "@/components/ui/ThinkingDots";
import { WindowFrame } from "@/components/ui/WindowFrame";
import {
  DEMO_ASK,
  DEMO_EXPERIENCE,
  DEMO_GREETING,
  DEMO_READY,
  DEMO_STEP,
  DEMO_USER_MESSAGE,
} from "@/features/landing/data/heroDemo";
import { cn } from "@/lib/utils";

function AssistantRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex animate-pop items-start gap-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-accent">
        <Dumbbell aria-hidden className="size-3.5 rotate-45" />
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ExperienceWidget({ answered }: { answered: boolean }) {
  return (
    <div className="mt-2.5 grid gap-1.5 rounded-2xl border border-line bg-surface p-1.5 shadow-card">
      {DEMO_EXPERIENCE.map((option, index) => {
        const selected = answered && index === 0;
        return (
          <div
            key={option.label}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-300",
              selected ? "border-accent-edge/60 bg-accent/60" : "border-line bg-surface",
              answered && !selected && "opacity-45",
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">{option.label}</p>
              <p className="truncate text-[11px] text-muted">{option.hint}</p>
            </div>
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                selected ? "border-ink bg-ink text-white" : "border-line-strong",
              )}
            >
              {selected && <Check aria-hidden className="size-3 animate-pop" strokeWidth={3} />}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function DemoChatWindow({ step, typed }: { step: number; typed: string }) {
  return (
    <WindowFrame title="FitX · Chat" className="h-[460px] md:h-[540px]">
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden p-4 sm:p-5 lg:justify-start">
        <AssistantRow>
          <p className="text-[13px] leading-relaxed text-ink-soft">{DEMO_GREETING}</p>
        </AssistantRow>

        {step >= DEMO_STEP.sent && (
          <div className="flex animate-pop justify-end">
            <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
              {DEMO_USER_MESSAGE}
            </p>
          </div>
        )}

        {step === DEMO_STEP.thinkingAsk && (
          <AssistantRow>
            <div className="flex h-7 items-center">
              <ThinkingDots />
            </div>
          </AssistantRow>
        )}

        {step >= DEMO_STEP.asked && (
          <AssistantRow>
            <p className="text-[13px] leading-relaxed text-ink-soft">{DEMO_ASK}</p>
            <ExperienceWidget answered={step >= DEMO_STEP.answered} />
          </AssistantRow>
        )}

        {step === DEMO_STEP.thinkingPlan && (
          <AssistantRow>
            <div className="flex h-7 items-center">
              <ThinkingDots />
            </div>
          </AssistantRow>
        )}

        {step >= DEMO_STEP.ready && (
          <AssistantRow>
            <p className="text-[13px] leading-relaxed text-ink-soft">{DEMO_READY}</p>
          </AssistantRow>
        )}
      </div>

      <div className="shrink-0 border-t border-line p-3">
        <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-sunken/70 pr-1.5 pl-4">
          <p className="min-w-0 flex-1 truncate text-[13px]">
            {step === DEMO_STEP.typing ? (
              <>
                {typed}
                <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-caret bg-ink" />
              </>
            ) : (
              <span className="text-subtle">Ask FitX anything…</span>
            )}
          </p>
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full transition-colors duration-300",
              step === DEMO_STEP.typing && typed.length > 0 ? "bg-ink text-white" : "bg-line text-subtle",
            )}
          >
            <ArrowUp aria-hidden className="size-4" />
          </span>
        </div>
      </div>
    </WindowFrame>
  );
}
