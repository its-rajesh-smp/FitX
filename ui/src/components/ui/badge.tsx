import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary", className)}>
      {children}
    </span>
  );
}
