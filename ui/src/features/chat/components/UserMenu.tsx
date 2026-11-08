import { LogOut, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { NewSessionDialog } from "@/features/chat/components/NewSessionDialog";

const getInitial = (name?: string) => name?.trim().charAt(0).toUpperCase() || "?";

export function UserMenu({
  userName,
  onLogout,
}: {
  userName?: string;
  onLogout: () => void;
}) {
  const [newSessionDialogOpen, setNewSessionDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        trigger={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open user menu"
            className="border-violet-edge bg-violet-tint text-violet-ink hover:bg-violet-edge/60 border text-[13px] font-semibold"
          >
            {getInitial(userName)}
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

