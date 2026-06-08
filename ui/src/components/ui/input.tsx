import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10",
        className,
      )}
      {...props}
    />
  );
}
