import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  accent: "bg-accent border border-accent-edge/70 text-ink hover:bg-accent-deep",
  secondary: "bg-surface border border-line text-ink shadow-card hover:bg-sunken",
} as const;

const SIZES = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
} as const;

type ButtonLinkProps = ComponentProps<"a"> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  withArrow?: boolean;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,transform] duration-200 active:scale-[0.98]",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 ease-calm group-hover:translate-x-0.5"
        />
      )}
    </a>
  );
}
