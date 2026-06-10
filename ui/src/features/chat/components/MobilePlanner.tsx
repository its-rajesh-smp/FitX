import { AnimatePresence, motion } from "motion/react";
import type { ProgramPlan } from "@/features/program/types/program";
import { WorkoutPlannerPanel } from "@/features/program/components/WorkoutPlannerPanel";

interface MobilePlannerProps {
  plan?: ProgramPlan | null;
  open: boolean;
  refreshSignal: number;
  isUpdating: boolean;
  onClose: () => void;
}

export function MobilePlanner({
  plan,
  open,
  refreshSignal,
  isUpdating,
  onClose,
}: MobilePlannerProps) {
  return (
    <AnimatePresence>
      {open && plan && (
        <motion.div
          key={`mobile-planner-${refreshSignal}`}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="fixed inset-x-0 top-14 bottom-0 z-30"
        >
          <WorkoutPlannerPanel
            plan={plan}
            onClose={onClose}
            isUpdating={isUpdating}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
