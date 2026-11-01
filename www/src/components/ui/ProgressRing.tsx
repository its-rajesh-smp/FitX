const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({ done, total }: { done: number; total: number }) {
  const ratio = total === 0 ? 0 : done / total;

  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 48 48" className="size-14 -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={RADIUS} fill="none" strokeWidth="4" className="stroke-line" />
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
          className="stroke-accent-edge transition-[stroke-dashoffset] duration-500 ease-calm"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs tabular-nums">
        {done}/{total}
      </span>
    </div>
  );
}
