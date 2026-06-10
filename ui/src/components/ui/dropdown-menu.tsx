import type { ReactNode } from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  destructive?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: "start" | "center" | "end";
}

export function DropdownMenu({
  trigger,
  items,
  align = "end",
}: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={6}
          className="z-50 min-w-40 rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {items.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.label}
              onSelect={item.onSelect}
              className={cn(
                "flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-muted",
                item.destructive &&
                  "text-destructive focus:bg-destructive/10 focus:text-destructive",
              )}
            >
              {item.icon}
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

