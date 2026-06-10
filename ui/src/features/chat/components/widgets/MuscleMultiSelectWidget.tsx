import { MultiSelectWidget } from "@/features/chat/components/widgets/MultiSelectWidget";
import { EXERCISE_MUSCLES } from "@/features/chat/constants/exerciseFilters";

export function MuscleMultiSelectWidget({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (values: string[]) => void;
}) {
  return (
    <MultiSelectWidget
      options={EXERCISE_MUSCLES}
      disabled={disabled}
      onSubmit={onSubmit}
    />
  );
}
