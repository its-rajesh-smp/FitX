import { useEffect, useRef, useState } from "react";
import { SkeletonPulse } from "@/features/chat/components/skeletons/SkeletonPulse";

export function ChatSkeleton({ hasChat }: { hasChat: boolean }) {
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
          <SkeletonPulse className="mx-auto size-12" />
          <SkeletonPulse className="mx-auto h-8 w-3/5" />
          <SkeletonPulse className="mx-auto h-3 w-4/5" />
          <SkeletonPulse className="mx-auto h-14 w-full rounded-xl" />
          <div className="flex justify-center gap-2">
            <SkeletonPulse className="h-8 w-32 rounded-full" />
            <SkeletonPulse className="h-8 w-36 rounded-full" />
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
            {!isCompact && <SkeletonPulse className="size-8 shrink-0" />}
            <div className="w-full space-y-2 sm:w-4/5">
              <SkeletonPulse className="h-3 w-full" />
              <SkeletonPulse className="h-3 w-3/4" />
              <SkeletonPulse className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex justify-end">
            <SkeletonPulse className="h-14 w-3/5 rounded-2xl" />
          </div>
          <div className="flex gap-3">
            {!isCompact && <SkeletonPulse className="size-8 shrink-0" />}
            <div className="w-full space-y-2 sm:w-4/5">
              <SkeletonPulse className="h-3 w-full" />
              <SkeletonPulse className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t p-4">
        <SkeletonPulse className="mx-auto h-12 max-w-3xl rounded-xl" />
      </div>
    </div>
  );
}

