import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

export function UserMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" size="icon" aria-label="Open user menu">
          <UserRound />
        </Button>
      }
      items={[
        {
          label: "Log out",
          icon: <LogOut className="size-4" />,
          onSelect: onLogout,
          destructive: true,
        },
      ]}
    />
  );
}

