import { MultiSelectWidget } from "@/features/chat/components/widgets/MultiSelectWidget";
import { EXERCISE_EQUIPMENT } from "@/features/chat/constants/exerciseFilters";

export function EquipmentMultiSelectWidget({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (values: string[]) => void;
}) {
  return (
    <MultiSelectWidget
      options={EXERCISE_EQUIPMENT}
      exclusiveOptions={["body only"]}
      disabled={disabled}
      onSubmit={onSubmit}
    />
  );
}
