import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ChatComposer({ onSend, isPending, large = false, autoFocus = false, placeholder = "Message FitX" }: { onSend: (message: string) => void; isPending: boolean; large?: boolean; autoFocus?: boolean; placeholder?: string }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const message = value.trim();
    if (!message || isPending) return;
    setValue("");
    onSend(message);
  };

  return (
    <form className={`flex items-end gap-2 rounded-2xl border bg-white p-2 shadow-card ${large ? "min-h-28" : ""}`} onSubmit={(event) => { event.preventDefault(); submit(); }}>
      <textarea
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        rows={large ? 3 : 1}
        className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none"
        placeholder={placeholder}
      />
      <Button type="submit" size="icon" className="rounded-xl" disabled={isPending || !value.trim()}><ArrowUp /></Button>
    </form>
  );
}
