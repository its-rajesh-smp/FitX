import { LogOut, RotateCcw, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { NewSessionDialog } from "@/features/chat/components/NewSessionDialog";

export function UserMenu({ onLogout }: { onLogout: () => void }) {
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        trigger={
          <Button variant="ghost" size="icon" aria-label="Open user menu">
            <UserRound />
          </Button>
        }
        items={[
          {
            label: "Start new session",
            icon: <RotateCcw className="size-4" />,
            onSelect: () => setNewSessionDialogOpen(true),
            destructive: true,
          },
          {
            label: "Log out",
            icon: <LogOut className="size-4" />,
            onSelect: onLogout,
          },
        ]}
      />
      <NewSessionDialog
        open={newSessionDialogOpen}
        onOpenChange={setNewSessionDialogOpen}
      />
    </>
  );
}

