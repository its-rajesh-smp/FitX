import { SectionHeading } from "@/features/landing/components/ui/SectionHeading";
import { GearTile } from "@/features/landing/components/features/GearTile";
import { AskTile } from "@/features/landing/components/features/AskTile";
import { SetupTile } from "@/features/landing/components/features/setup/SetupTile";
import { MemoryTile } from "@/features/landing/components/features/StaticTiles";
import { SwapTile } from "@/features/landing/components/features/SwapTile";
import { VideoTile } from "@/features/landing/components/features/VideoTile";

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="reveal">
        <SectionHeading
          index={2}
          badge="Features"
          title="Everything a good coach does, in one chat"
          description="FitX listens, plans around your life and adjusts when things change."
        />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
        <SetupTile className="reveal md:col-span-2" />
        <VideoTile className="reveal" />
        <MemoryTile className="reveal" />
        <SwapTile className="reveal md:col-span-2" />
        <GearTile className="reveal" />
        <AskTile className="reveal" />
      </div>
    </section>
  );
}
