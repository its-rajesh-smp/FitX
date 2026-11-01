import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A light app window used to show the product on the dark stage. */
export function WindowFrame({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-window",
        className,
      )}
    >
      <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-line bg-sunken/60 px-4">
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 truncate text-xs font-medium text-subtle">{title}</span>
      </div>
      {children}
    </div>
  );
}
