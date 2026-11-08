import { FACTS } from "@/features/landing/data/landing";
import { useCountUp } from "@/features/landing/hooks/useCountUp";

function Fact({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: shown } = useCountUp<HTMLParagraphElement>(value);

  return (
    <div className="flex flex-col gap-1 border-line px-4 py-6 odd:border-r sm:px-8 lg:border-r lg:last:border-r-0 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0">
      <p ref={ref} className="font-mono text-4xl tabular-nums sm:text-5xl">
        {shown}
        {suffix}
      </p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export function FactsRow() {
  return (
    <section aria-label="FitX in numbers" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
      <div className="reveal grid grid-cols-2 border-y border-line lg:grid-cols-4">
        {FACTS.map((fact) => (
          <Fact key={fact.label} {...fact} />
        ))}
      </div>
    </section>
  );
}
