import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP } from "@/constants/app";
import { UserMenu } from "@/features/chat/components/UserMenu";

interface ChatHeaderProps {
  hasPlan: boolean;
  isDesktop: boolean;
  chatCollapsed: boolean;
  mobilePlannerOpen: boolean;
  onToggleChat: () => void;
  onToggleMobilePlanner: () => void;
  onLogout: () => void;
}

export function ChatHeader({
  hasPlan,
  isDesktop,
  chatCollapsed,
  mobilePlannerOpen,
  onToggleChat,
  onToggleMobilePlanner,
  onLogout,
}: ChatHeaderProps) {
  const panelLabel = isDesktop
    ? chatCollapsed
      ? "Show chat"
      : "Hide chat"
    : mobilePlannerOpen
      ? "Close workout planner"
      : "Open workout planner";

  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b bg-white/95 px-3 backdrop-blur sm:px-4">
      <div className="flex items-center gap-2.5">
        <img src={APP.icon} alt="" className="size-8" />
        <div>
          <h1 className="text-sm font-bold">{APP.name}</h1>
          <p className="text-[10px] text-muted-foreground">AI fitness coach</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {hasPlan && (
          <Button
            variant="outline"
            onClick={isDesktop ? onToggleChat : onToggleMobilePlanner}
            aria-label={panelLabel}
          >
            {isDesktop ? (
              chatCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />
            ) : (
              <PanelRightOpen />
            )}
            <span className="hidden sm:inline">
              {isDesktop
                ? chatCollapsed
                  ? "Show chat"
                  : "Hide chat"
                : mobilePlannerOpen
                  ? "Close Planner"
                  : "Workout Planner"}
            </span>
          </Button>
        )}
        <UserMenu onLogout={onLogout} />
      </div>
    </header>
  );
}
