import { cn } from "@/lib/utils";

/** Section badge with the FitX signature: a mono "SET 01" index chip. */
export function SetBadge({
  index,
  label,
  className,
}: {
  index: number;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3 pl-1 text-[13px] font-medium shadow-card",
        className,
      )}
    >
      <span className="rounded-full bg-sunken px-2 py-0.5 font-mono text-[11px] tracking-wide text-accent-edge">
        SET {String(index).padStart(2, "0")}
      </span>
      {label}
    </span>
  );
}
