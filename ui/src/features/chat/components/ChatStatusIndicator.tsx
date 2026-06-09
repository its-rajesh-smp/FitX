import { Brain, Dumbbell, Save, Search, Sparkles } from "lucide-react";
import type { ChatStatus } from "@/features/chat/services/streamChatMessage";

const icons = {
  thinking: Brain,
  responding: Sparkles,
  getting_options: Search,
  getting_exercises: Dumbbell,
  getting_plan: Search,
  generating_plan: Dumbbell,
  updating_plan: Save,
};

export function ChatStatusIndicator({ status, label }: { status: ChatStatus; label: string }) {
  const Icon = icons[status];
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <Icon className="size-3.5 animate-pulse text-primary" />
      {label}
      <span className="flex gap-1"><i className="size-1 animate-bounce rounded-full bg-primary [animation-delay:-.2s]" /><i className="size-1 animate-bounce rounded-full bg-primary [animation-delay:-.1s]" /><i className="size-1 animate-bounce rounded-full bg-primary" /></span>
    </span>
  );
}
