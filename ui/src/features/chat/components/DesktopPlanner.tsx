import { motion } from "motion/react";
import type { ProgramPlan } from "@/features/program/types/program";
import { WorkoutPlannerPanel } from "@/features/program/components/WorkoutPlannerPanel";
import { cn } from "@/lib/utils";

interface DesktopPlannerProps {
  plan: ProgramPlan;
  refreshSignal: number;
  collapsed: boolean;
  isUpdating: boolean;
  onClose: () => void;
}

export function DesktopPlanner({
  plan,
  refreshSignal,
  collapsed,
  isUpdating,
  onClose,
}: DesktopPlannerProps) {
  return (
    <motion.div
      key={`${plan.id}-${refreshSignal}`}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn("h-full", collapsed && "hidden")}
    >
      <WorkoutPlannerPanel
        plan={plan}
        onClose={onClose}
        isUpdating={isUpdating}
      />
    </motion.div>
  );
}

