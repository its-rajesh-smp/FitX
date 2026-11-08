import gearImage from "@/assets/landing/card_gear.webp";
import { Card } from "@/features/landing/components/ui/Card";
import { ToggleChip } from "@/features/landing/components/ui/ToggleChip";
import { TileBackdrop } from "@/features/landing/components/features/TileBackdrop";
import { TileHeading } from "@/features/landing/components/features/TileHeading";
import { EQUIPMENT_CHOICES } from "@/features/landing/data/landing";
import { useToggleSet } from "@/features/landing/hooks/useToggleSet";
import { cn } from "@/lib/utils";

export function GearTile({ className }: { className?: string }) {
  const { selected, toggle } = useToggleSet<string>(["Body only", "Dumbbell"]);

  return (
    <Card className={cn("relative isolate flex flex-col gap-6 overflow-hidden", className)}>
      <TileBackdrop src={gearImage} />
      <TileHeading
        tone="iris"
        lead="Built around"
        rest="your gear"
        text="A living room or a full gym. FitX only picks exercises you can actually do."
      />
      <div className="mt-auto flex flex-wrap gap-1.5">
        {EQUIPMENT_CHOICES.map((item) => (
          <ToggleChip
            key={item}
            label={item}
            selected={selected.has(item)}
            onToggle={() => toggle(item)}
          />
        ))}
      </div>
    </Card>
  );
}
