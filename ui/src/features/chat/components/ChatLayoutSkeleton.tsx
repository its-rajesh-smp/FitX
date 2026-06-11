import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { APP } from "@/constants/app";
import { ChatSkeleton } from "@/features/chat/components/skeletons/ChatSkeleton";
import { PlannerSkeleton } from "@/features/chat/components/skeletons/PlannerSkeleton";
import { SkeletonPulse } from "@/features/chat/components/skeletons/SkeletonPulse";

interface ChatLayoutSkeletonProps {
  hasChat: boolean;
  hasPlan: boolean;
  isDesktop: boolean;
  panelLayout?: { chat: number; planner: number };
}

export function ChatLayoutSkeleton({
  hasChat,
  hasPlan,
  isDesktop,
  panelLayout,
}: ChatLayoutSkeletonProps) {
  const showPlanner = hasPlan && isDesktop;

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-4">
        <div className="flex items-center gap-2.5">
          <img src={APP.icon} alt="" className="size-8" />
          <div className="space-y-1.5">
            <SkeletonPulse className="h-3 w-12" />
            <SkeletonPulse className="h-2 w-20" />
          </div>
        </div>
        <SkeletonPulse className="size-8" />
      </header>

      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1"
        defaultLayout={
          showPlanner
            ? (panelLayout ?? { chat: 44, planner: 56 })
            : { chat: 100 }
        }
        disabled
      >
        <ResizablePanel id="chat" className="flex min-w-0 flex-col">
          <ChatSkeleton hasChat={hasChat} />
        </ResizablePanel>
        {showPlanner && (
          <>
            <ResizableHandle withHandle className="hidden lg:flex" disabled />
            <ResizablePanel id="planner" className="overflow-hidden">
              <PlannerSkeleton />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
