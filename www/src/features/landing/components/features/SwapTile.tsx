"use client";

import { ArrowUp, Dumbbell, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import swapImage from "@/assets/images/card_swap.webp";
import { Card } from "@/components/ui/Card";
import { ThinkingDots } from "@/components/ui/ThinkingDots";
import { TileBackdrop } from "@/features/landing/components/features/TileBackdrop";
import { TileHeading } from "@/features/landing/components/features/TileHeading";
import { SWAP_DEMO } from "@/features/landing/data/landing";
import { cn } from "@/lib/utils";

type SwapState = "idle" | "thinking" | "swapped";

function ExerciseRow({ name, detail, swapped }: { name: string; detail: string; swapped: boolean }) {
  return (
    <div
      className={cn(
        "flex animate-pop items-center gap-3 rounded-2xl border bg-surface px-3 py-2.5 shadow-card",
        swapped ? "border-accent-edge/60" : "border-line",
      )}
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-xl",
          swapped ? "bg-accent text-ink" : "bg-sunken text-muted",
        )}
      >
        <Dumbbell aria-hidden className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-muted">{detail}</p>
      </div>
      {swapped && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold">Swapped</span>
      )}
    </div>
  );
}

export function SwapTile({ className }: { className?: string }) {
  const [state, setState] = useState<SwapState>("idle");

  useEffect(() => {
    if (state !== "thinking") return;
    const timer = setTimeout(() => setState("swapped"), 1100);
    return () => clearTimeout(timer);
  }, [state]);

  const exercise = state === "swapped" ? SWAP_DEMO.after : SWAP_DEMO.before;

  return (
    <Card className={cn("relative isolate flex flex-col gap-6 overflow-hidden", className)}>
      <TileBackdrop src={swapImage} />
      <TileHeading
        tone="violet"
        lead="Change it"
        rest="by chatting"
        text="Sore knee, busy Thursday, no dumbbells this week? Ask, and your plan updates in place."
      />

      <div className="mt-auto grid grid-cols-1 gap-3 rounded-[20px] bg-sunken p-3 sm:p-4">
        <ExerciseRow
          key={exercise.name}
          name={exercise.name}
          detail={exercise.detail}
          swapped={state === "swapped"}
        />

        {/* The invisible reply reserves its space, so the card keeps one height in every state. */}
        <div className="grid">
          <p aria-hidden className="invisible col-start-1 row-start-1 text-[13px] leading-relaxed">
            {SWAP_DEMO.reply}
          </p>
          {state === "thinking" && (
            <span className="col-start-1 row-start-1 flex h-5 items-center pl-1">
              <ThinkingDots />
            </span>
          )}
          {state === "swapped" && (
            <p className="col-start-1 row-start-1 animate-pop text-[13px] leading-relaxed text-ink-soft">
              {SWAP_DEMO.reply}
            </p>
          )}
        </div>

        <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-surface pr-1.5 pl-4">
          <p className="min-w-0 flex-1 truncate text-[13px]">{SWAP_DEMO.request}</p>
          {state === "swapped" ? (
            <button
              type="button"
              onClick={() => setState("idle")}
              aria-label="Reset the demo"
              className="group flex size-8 items-center justify-center rounded-full bg-sunken text-muted transition-colors hover:text-ink"
            >
              <RotateCcw aria-hidden className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
            </button>
          ) : (
            <button
              type="button"
              disabled={state === "thinking"}
              onClick={() => setState("thinking")}
              className="group flex h-8 items-center gap-1.5 rounded-full bg-ink pr-2 pl-3 text-xs font-semibold text-white transition-[background-color,transform] hover:bg-ink-soft active:scale-95 disabled:bg-line disabled:text-subtle"
            >
              Send
              <ArrowUp aria-hidden className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
