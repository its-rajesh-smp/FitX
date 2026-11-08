/** Pastel icon tiles for option widgets (replaces traffic-light emerald/amber/red). */
export const WIDGET_TONES = {
  violet: "bg-violet-tint text-violet-ink",
  iris: "bg-iris-tint text-iris-ink",
  peach: "bg-peach-tint text-peach-ink",
  rose: "bg-rose-tint text-rose-ink",
} as const;

/** One option row in a single-choice widget. */
export const WIDGET_OPTION_CLASS =
  "group hover:border-accent-edge/50 hover:bg-violet-tint/50 h-auto min-h-16 w-full justify-start gap-3 rounded-2xl border-border bg-white px-3 py-3 text-left whitespace-normal";

/** A pill chip that can be selected; pair with `WIDGET_CHIP_SELECTED_CLASS`. */
export const WIDGET_CHIP_CLASS =
  "border-input hover:border-accent-edge/60 hover:bg-violet-tint h-8 rounded-full bg-white px-3.5 text-[13px] capitalize";
export const WIDGET_CHIP_SELECTED_CLASS =
  "border-accent-edge bg-accent hover:bg-accent text-foreground";
