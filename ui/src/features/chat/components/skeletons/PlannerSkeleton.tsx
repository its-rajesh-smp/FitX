import { SkeletonPulse } from "@/features/chat/components/skeletons/SkeletonPulse";

export function PlannerSkeleton() {
  return (
    <aside className="flex h-full min-h-0 flex-col bg-canvas">
      <div className="flex h-14 items-center border-b bg-white px-4">
        <div className="space-y-1.5">
          <SkeletonPulse className="h-3 w-28" />
          <SkeletonPulse className="h-2 w-20" />
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <SkeletonPulse className="h-6 w-56" />
          <SkeletonPulse className="h-3 w-40" />
        </div>
        <div className="overflow-hidden rounded-2xl border bg-white">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 border-b p-4 last:border-0"
            >
              <SkeletonPulse className="size-3 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonPulse className="h-3 w-40" />
                <SkeletonPulse className="h-2 w-24" />
              </div>
              <SkeletonPulse className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

