import { ShieldCheck } from "lucide-react";
import { APP } from "@/constants/app";

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <img src={APP.icon} alt="" className="size-4" /> {APP.name}
        </div>
        <p>Train with clarity. Adapt with confidence.</p>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-4" /> Built around your needs
        </div>
      </div>
    </footer>
  );
}
