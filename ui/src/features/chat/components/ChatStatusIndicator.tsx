import { Brain, Dumbbell, Save, Search, Sparkles } from "lucide-react";
import type { ChatStatus } from "@/features/chat/services/streamChatMessage";

const icons = {
  thinking: Brain,
  responding: Sparkles,
  getting_exercises: Dumbbell,
  getting_plan: Search,
  generating_plan: Dumbbell,
  updating_plan: Save,
};

const WAVE_DELAYS = ["[animation-delay:0ms]", "[animation-delay:150ms]", "[animation-delay:300ms]"];

export function ChatStatusIndicator({ status, label }: { status: ChatStatus; label: string }) {
  const Icon = icons[status];
  return (
    <span className="text-muted-foreground inline-flex items-center gap-2 text-[13px] font-medium">
      <Icon className="text-accent-edge size-3.5" />
      {label}
      <span aria-hidden className="flex items-center gap-1">
        {WAVE_DELAYS.map((delay) => (
          <i key={delay} className={`bg-accent-edge animate-wave size-1 rounded-full ${delay}`} />
        ))}
      </span>
    </span>
  );
}
