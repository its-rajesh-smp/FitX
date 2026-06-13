import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_TEXTAREA_HEIGHT = 160;
const PLACEHOLDER_ROTATION_INTERVAL = 3000;

export function ChatComposer({
  onSend,
  isPending,
  large = false,
  focusSignal = 0,
  highlighted = false,
  placeholder = "Message FitX",
  placeholderOptions,
}: {
  onSend: (message: string) => void;
  isPending: boolean;
  large?: boolean;
  focusSignal?: number;
  highlighted?: boolean;
  placeholder?: string;
  placeholderOptions?: readonly string[];
}) {
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const activePlaceholder =
    placeholderOptions?.[placeholderIndex % placeholderOptions.length] ??
    placeholder;

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

  useEffect(() => {
    if (value || !placeholderOptions || placeholderOptions.length < 2) return;

    const interval = window.setInterval(() => {
      setPlaceholderIndex((index) => (index + 1) % placeholderOptions.length);
    }, PLACEHOLDER_ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [placeholderOptions, value]);

  const submit = () => {
    const message = value.trim();
    if (!message || isPending) return;
    setValue("");
    onSend(message);
  };

  return (
    <form
      className={cn(
        "shadow-card flex items-end gap-2 rounded-3xl border bg-white p-2 transition-[border-color,box-shadow]",
        large &&
          "border-primary/15 min-h-28 bg-white/95 p-3 shadow-[0_18px_55px_rgb(30_20_70/0.10)] focus-within:border-primary/40 focus-within:shadow-[0_22px_65px_rgb(30_20_70/0.14)]",
        highlighted && "border-primary ring-primary/15 ring-3",
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
          large && "min-h-20 px-4 py-3 text-[15px]",
        )}
        placeholder={activePlaceholder}
      />
      <Button
        type="submit"
        size="icon"
        className={cn(
          "mb-0.5 rounded-full",
          large && "size-10 shadow-sm transition-transform hover:-translate-y-0.5",
        )}
        disabled={isPending || !value.trim()}
        aria-label="Send message"
      >
        <ArrowUp />
      </Button>
    </form>
  );
}
