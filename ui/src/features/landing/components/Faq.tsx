import { Plus } from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "@/features/landing/components/ui/SectionHeading";
import { FAQS } from "@/features/landing/data/landing";
import { cn } from "@/lib/utils";

export function Faq() {
  // Only one answer is open at a time; the first starts open.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="reveal">
        <SectionHeading
          index={4}
          badge="FAQ"
          title="Questions, answered"
          description="The short version of what FitX does, and what it doesn't do yet."
        />
      </div>

      <div className="reveal mx-auto mt-14 max-w-3xl divide-y divide-line rounded-[28px] border border-line bg-surface shadow-card">
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          const panelId = `faq-panel-${index}`;
          return (
            <div key={faq.question} className="px-5 sm:px-7">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold sm:text-base"
                >
                  {faq.question}
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] duration-300 ease-calm",
                      open ? "rotate-45 bg-accent" : "bg-sunken",
                    )}
                  >
                    <Plus aria-hidden className="size-4" />
                  </span>
                </button>
              </h3>
              {/* Animating grid rows from 0fr to 1fr gives a smooth height transition. */}
              <div
                id={panelId}
                role="region"
                aria-hidden={!open}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-calm",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="-mt-1 max-w-2xl pb-5 text-[15px] leading-relaxed text-pretty text-muted">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
