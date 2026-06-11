import { Button } from "@/components/ui/button";
import { APP } from "@/constants/app";
import { UserMenu } from "@/features/chat/components/UserMenu";
import { PanelLeftClose, PanelLeftOpen, PanelRightOpen } from "lucide-react";

interface ChatHeaderProps {
  hasPlan: boolean;
  isDesktop: boolean;
  chatCollapsed: boolean;
  mobilePlannerOpen: boolean;
  onToggleChat: () => void;
  onToggleMobilePlanner: () => void;
  onLogout: () => void;
}

const getPanelLabel = (
  isDesktop: boolean,
  chatCollapsed: boolean,
  mobilePlannerOpen: boolean,
) => {
  if (isDesktop) {
    return chatCollapsed ? "Show chat" : "Hide chat";
  }
  return mobilePlannerOpen ? "Close workout planner" : "Open workout planner";
};

export function ChatHeader({
  hasPlan,
  isDesktop,
  chatCollapsed,
  mobilePlannerOpen,
  onToggleChat,
  onToggleMobilePlanner,
  onLogout,
}: ChatHeaderProps) {
  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b bg-white/95 px-3 backdrop-blur sm:px-4">
      <div className="flex items-center gap-2.5">
        <img src={APP.icon} alt="" className="size-8" />
        <div>
          <h1 className="text-sm font-bold">{APP.name}</h1>
          <p className="text-muted-foreground text-[10px]">AI fitness coach</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {hasPlan && (
          <Button
            variant="outline"
            onClick={isDesktop ? onToggleChat : onToggleMobilePlanner}
          >
            {isDesktop ? (
              chatCollapsed ? (
                <PanelLeftOpen />
              ) : (
                <PanelLeftClose />
              )
            ) : (
              <PanelRightOpen />
            )}
            <span className="hidden sm:inline">
              {getPanelLabel(isDesktop, chatCollapsed, mobilePlannerOpen)}
            </span>
          </Button>
        )}
        <UserMenu onLogout={onLogout} />
      </div>
    </header>
  );
}
