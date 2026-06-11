import { PlanShortcut } from "@/features/chat/components/PlanShortcut";
import { EquipmentMultiSelectWidget } from "@/features/chat/components/widgets/EquipmentMultiSelectWidget";
import { ExperienceLevelWidget } from "@/features/chat/components/widgets/ExperienceLevelWidget";
import { MuscleMultiSelectWidget } from "@/features/chat/components/widgets/MuscleMultiSelectWidget";
import type { ChatWidget } from "@/features/chat/types/chat";

export function ChatWidgetRenderer({
  widget,
  disabled,
  answered,
  onOpenPlan,
  onSubmit,
}: {
  widget: ChatWidget;
  disabled: boolean;
  answered: boolean;
  onOpenPlan: () => void;
  onSubmit: (values: string[]) => void;
}) {
  if (answered && widget.type !== "user_plan") return null;

  switch (widget.type) {
    case "none":
      return null;
    case "experience_level":
      return <ExperienceLevelWidget disabled={disabled} onSubmit={onSubmit} />;
    case "muscle_multi_select":
      return (
        <MuscleMultiSelectWidget disabled={disabled} onSubmit={onSubmit} />
      );
    case "equipment_multi_select":
      return (
        <EquipmentMultiSelectWidget disabled={disabled} onSubmit={onSubmit} />
      );
    case "user_plan":
      return (
        <PlanShortcut
          label={widget.label}
          disabled={disabled}
          onOpen={onOpenPlan}
        />
      );
  }
}
