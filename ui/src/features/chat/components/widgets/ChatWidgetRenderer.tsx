import { EquipmentMultiSelectWidget } from "@/features/chat/components/widgets/EquipmentMultiSelectWidget";
import { MuscleMultiSelectWidget } from "@/features/chat/components/widgets/MuscleMultiSelectWidget";
import type { ChatWidget } from "@/features/chat/types/chat";

export function ChatWidgetRenderer({
  widget,
  disabled,
  answered,
  onSubmit,
}: {
  widget: ChatWidget;
  disabled: boolean;
  answered: boolean;
  onSubmit: (values: string[]) => void;
}) {
  if (answered) return null;

  switch (widget.type) {
    case "muscle_multi_select":
      return <MuscleMultiSelectWidget disabled={disabled} onSubmit={onSubmit} />;
    case "equipment_multi_select":
      return <EquipmentMultiSelectWidget disabled={disabled} onSubmit={onSubmit} />;
  }
}
