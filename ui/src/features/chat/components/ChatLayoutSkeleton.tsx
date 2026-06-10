import appIcon from "@/assets/logo.png";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from "react";

const Pulse = ({ className }: { className: string }) => (
  <div className={`bg-muted animate-pulse rounded-lg ${className}`} />
);

export function ChatLayoutSkeleton({
  hasChat,
  hasPlan,
  isDesktop,
  panelLayout,
}: {
  hasChat: boolean;
  hasPlan: boolean;
  isDesktop: boolean;
  panelLayout?: { chat: number; planner: number };
}) {
  const showPlanner = hasPlan && isDesktop;

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-3 sm:px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg text-white">
            <img src={appIcon} />
          </div>
          <div className="space-y-1.5">
            <Pulse className="h-3 w-12" />
            <Pulse className="h-2 w-20" />
          </div>
        </div>
        <Pulse className="size-8" />
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

function ChatSkeleton({ hasChat }: { hasChat: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsCompact(entry.contentRect.width < 480);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  if (!hasChat) {
    return (
      <div
        ref={contentRef}
        className="flex flex-1 items-center justify-center px-4"
      >
        <div className="w-full max-w-2xl space-y-5">
          <Pulse className="mx-auto size-12" />
          <Pulse className="mx-auto h-8 w-3/5" />
          <Pulse className="mx-auto h-3 w-4/5" />
          <Pulse className="mx-auto h-14 w-full rounded-xl" />
          <div className="flex justify-center gap-2">
            <Pulse className="h-8 w-32 rounded-full" />
            <Pulse className="h-8 w-36 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-7 overflow-hidden px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-7">
          <div className="flex gap-3">
            {!isCompact && <Pulse className="size-8 shrink-0" />}
            <div className="w-full space-y-2 sm:w-4/5">
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-3/4" />
              <Pulse className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex justify-end">
            <Pulse className="h-14 w-3/5 rounded-2xl" />
          </div>
          <div className="flex gap-3">
            {!isCompact && <Pulse className="size-8 shrink-0" />}
            <div className="w-full space-y-2 sm:w-4/5">
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t p-4">
        <Pulse className="mx-auto h-12 max-w-3xl rounded-xl" />
      </div>
    </div>
  );
}

function PlannerSkeleton() {
  return (
    <aside className="bg-canvas flex h-full min-h-0 flex-col">
      <div className="flex h-14 items-center border-b bg-white px-4">
        <div className="space-y-1.5">
          <Pulse className="h-3 w-28" />
          <Pulse className="h-2 w-20" />
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <Pulse className="h-6 w-56" />
          <Pulse className="h-3 w-40" />
        </div>
        <div className="overflow-hidden rounded-2xl border bg-white">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 border-b p-4 last:border-0"
            >
              <Pulse className="size-3 rounded-full" />
              <div className="flex-1 space-y-2">
                <Pulse className="h-3 w-40" />
                <Pulse className="h-2 w-24" />
              </div>
              <Pulse className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
