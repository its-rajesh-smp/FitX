import { Dumbbell, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgramPreview } from "@/features/chat/components/ProgramPreview";
import { cn } from "@/lib/utils";

const initialMessages = [
  { role: "ai", text: "Hey Alex! I'm FitAI, your personal workout planner. To build the perfect program for you, let me ask a few quick questions. What's your main fitness goal right now?" },
  { role: "user", text: "I want to build muscle. I've been working out on and off for about a year." },
  { role: "ai", text: "Love that goal! Building muscle with some training history is a great starting point — you'll see results faster than a complete beginner. A few more things to dial in your plan:" },
  { role: "user", text: "I have dumbbells at home, a pull-up bar, and some resistance bands." },
  { role: "ai", text: "Perfect setup — honestly that's all you need. Last question: how many days per week can you commit, and roughly how long per session?" },
  { role: "user", text: "4 days a week, around 45 minutes each." },
  { role: "ai", text: "Based on everything you told me, here's your 4-week muscle building program:", preview: true },
];

export function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    setMessages((current) => [...current, { role: "user", text: value.trim() }]);
    setValue("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4 sm:px-8">
        <div><h1 className="text-lg font-extrabold">AI Planner</h1><p className="text-xs text-muted-foreground">Adapt, plan, and ask anything</p></div>
        <Button variant="outline">New Plan</Button>
      </header>
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
        <div className="space-y-7">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex", message.role === "user" && "justify-end")}>
              <div className={cn("max-w-[92%] sm:max-w-[82%]", message.role === "user" && "text-right")}>
                {message.role === "ai" && <p className="mb-2 flex items-center gap-1 text-xs font-bold text-muted-foreground"><Dumbbell className="size-3 text-primary" />FitAI</p>}
                <div className={cn("rounded-xl px-4 py-3 text-left text-sm leading-relaxed", message.role === "ai" ? "border bg-white shadow-card" : "bg-primary-soft text-primary")}>
                  {message.text}
                  {message.preview && <ProgramPreview />}
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">{`6:${23 + index * 3} AM`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 border-t bg-white p-4">
        <form className="mx-auto flex max-w-3xl gap-2 rounded-full border bg-white p-1.5 shadow-card" onSubmit={(event) => { event.preventDefault(); send(); }}>
          <input value={value} onChange={(event) => setValue(event.target.value)} className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none" placeholder="Ask me anything about your workouts..." />
          <Button type="submit" size="icon" className="rounded-full"><Send /></Button>
        </form>
      </div>
    </div>
  );
}
