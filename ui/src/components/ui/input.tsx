import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border bg-white px-3.5 text-sm transition-all outline-none focus:ring-3",
        className,
      )}
      {...props}
    />
  );
}
