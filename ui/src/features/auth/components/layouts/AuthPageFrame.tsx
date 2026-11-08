import { ArrowLeft, Dumbbell } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { APP } from "@/constants/app";
import { AuthArtPanel } from "./AuthArtPanel";

function Wordmark() {
  return (
    <Link to="/" className="flex w-fit items-center gap-2.5 text-ink">
      <span className="flex size-6 items-center justify-center rounded-full bg-ink text-accent">
        <Dumbbell aria-hidden className="size-3.5 rotate-45" strokeWidth={2.25} />
      </span>
      <span className="font-mono text-[12px] tracking-[0.3em] uppercase">
        {APP.productName}
      </span>
    </Link>
  );
}

export function AuthPageFrame({ children }: { children: ReactNode }) {
  return (
    // `.site` gives auth the same type and lilac palette as the landing page.
    <main className="site grid h-dvh grid-rows-1 overflow-hidden lg:grid-cols-[1.4fr_1fr]">
      <AuthArtPanel wordmark={<Wordmark />} />

      {/* Fixed-height column: it must never scroll, even on short screens. */}
      <section className="flex h-full flex-col overflow-hidden px-6">
        <div className="flex h-16 shrink-0 items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-3.5" />
            Back
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center pb-16">
          <div className="mb-8 lg:hidden">
            <Wordmark />
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
