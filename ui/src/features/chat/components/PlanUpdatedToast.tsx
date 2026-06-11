import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function PlanUpdatedToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg sm:right-6 sm:bottom-6 sm:left-auto sm:translate-x-0"
        >
          <CheckCircle2 className="size-4 text-success" />
          Plan updated
        </motion.div>
      )}
    </AnimatePresence>
  );
}
