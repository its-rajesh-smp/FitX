import type { ReactNode } from "react";
import { GoogleButton } from "./GoogleButton";

export function AuthFormCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="w-full max-w-[400px]">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
        <h1 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{title}</h1>
        <p className="mt-1 text-[13px] text-muted">{description}</p>

        <div className="mt-6">
          <GoogleButton />
        </div>

        <div className="my-5 flex items-center gap-3 text-[12px] text-subtle">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>

        {children}
      </div>

      {/* The sign-in / sign-up switch lives under the card, not inside it. */}
      <p className="mt-6 text-center text-[13px] text-muted">{footer}</p>
    </div>
  );
}

export function AuthField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-danger">{error}</span>}
    </label>
  );
}
