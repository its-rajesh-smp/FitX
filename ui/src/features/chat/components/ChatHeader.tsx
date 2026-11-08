import { BrandMark } from "@/components/ui/BrandMark";
import { Button } from "@/components/ui/button";
import { APP } from "@/constants/app";
import { UserMenu } from "@/features/chat/components/UserMenu";
import { PanelLeftClose, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface ChatHeaderProps {
  userName?: string;
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
  userName,
  hasPlan,
  isDesktop,
  chatCollapsed,
  mobilePlannerOpen,
  onToggleChat,
  onToggleMobilePlanner,
  onLogout,
}: ChatHeaderProps) {
  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b bg-white/90 px-3 backdrop-blur-xl sm:px-5">
      <Link
        to="/"
        aria-label="Go to FitX home page"
        className="flex cursor-pointer items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <BrandMark />
        <h1 className="text-[16px] leading-none font-semibold tracking-[-0.02em]">
          {APP.name}
        </h1>
      </Link>

      <div className="flex items-center gap-2">
        {hasPlan && (
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground h-8 px-3 text-[13px]"
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
        <UserMenu userName={userName} onLogout={onLogout} />
      </div>
    </header>
  );
}
