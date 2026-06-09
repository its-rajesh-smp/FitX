import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_TEXTAREA_HEIGHT = 160;

export function ChatComposer({
  onSend,
  isPending,
  large = false,
  focusSignal = 0,
  highlighted = false,
  placeholder = "Message FitX",
}: {
  onSend: (message: string) => void;
  isPending: boolean;
  large?: boolean;
  focusSignal?: number;
  highlighted?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  useEffect(() => {
    if (!focusSignal) return;
    textareaRef.current?.focus();
  }, [focusSignal]);

  useEffect(resizeTextarea, [value]);

  const submit = () => {
    const message = value.trim();
    if (!message || isPending) return;
    setValue("");
    onSend(message);
  };

  return (
    <form
      className={cn(
        "flex items-end gap-2 rounded-3xl border bg-white p-2 shadow-card transition-[border-color,box-shadow]",
        large && "min-h-28",
        highlighted && "border-primary ring-3 ring-primary/15",
      )}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        rows={1}
        className={cn(
          "min-h-10 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-sm leading-6 outline-none",
          large && "min-h-20",
        )}
        placeholder={placeholder}
      />
      <Button
        type="submit"
        size="icon"
        className="mb-0.5 rounded-full"
        disabled={isPending || !value.trim()}
        aria-label="Send message"
      >
        <ArrowUp />
      </Button>
    </form>
  );
}
