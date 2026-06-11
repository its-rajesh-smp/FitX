import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={isVisible ? "text" : "password"}
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-primary absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-xl transition-colors outline-none focus-visible:ring-2"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
      >
        {isVisible ? (
          <EyeOff className="size-4.5" />
        ) : (
          <Eye className="size-4.5" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
