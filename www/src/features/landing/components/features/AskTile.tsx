"use client";

import { useState } from "react";
import askImage from "@/assets/images/card_ask.webp";
import { Card } from "@/components/ui/Card";
import { TileBackdrop } from "@/features/landing/components/features/TileBackdrop";
import { TileHeading } from "@/features/landing/components/features/TileHeading";
import { ASK_QA } from "@/features/landing/data/landing";
import { useTypewriter } from "@/features/landing/hooks/useTypewriter";
import { cn } from "@/lib/utils";

const QUESTION_BUBBLE =
  "col-start-1 row-start-1 max-w-[90%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-[13px] text-white";
const ANSWER_BUBBLE =
  "col-start-1 row-start-1 max-w-[95%] rounded-2xl rounded-bl-md border border-line bg-sunken px-3 py-2 text-[13px] leading-relaxed text-ink-soft";

export function AskTile({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const { question, answer } = ASK_QA[active];
  const typed = useTypewriter(answer, true, 18);

  return (
    <Card className={cn("relative isolate flex flex-col gap-6 overflow-hidden", className)}>
      <TileBackdrop src={askImage} />
      <TileHeading
        tone="rose"
        lead="Ask"
        rest="anything about training"
        text="Not every question needs a new plan. Tap a question to try it."
      />
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {ASK_QA.map((qa, index) => (
            <button
              key={qa.question}
              type="button"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors active:scale-95",
                index === active
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {qa.chip}
            </button>
          ))}
        </div>
        {/* Every question and answer is stacked invisibly, so the bubbles always size to the longest one. */}
        <div className="grid justify-items-end">
          {ASK_QA.map((qa) => (
            <p key={qa.question} aria-hidden className={cn(QUESTION_BUBBLE, "invisible")}>
              {qa.question}
            </p>
          ))}
          <p key={question} className={cn(QUESTION_BUBBLE, "animate-pop")}>
            {question}
          </p>
        </div>
        <div className="grid">
          {ASK_QA.map((qa) => (
            <p key={qa.answer} aria-hidden className={cn(ANSWER_BUBBLE, "invisible")}>
              {qa.answer}
            </p>
          ))}
          <p aria-live="polite" className={ANSWER_BUBBLE}>
            {typed}
            {typed.length < answer.length && (
              <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-caret bg-ink" />
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
