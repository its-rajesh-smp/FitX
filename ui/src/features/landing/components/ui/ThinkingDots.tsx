const DOT_DELAYS = ["[animation-delay:0ms]", "[animation-delay:150ms]", "[animation-delay:300ms]"];

export function ThinkingDots() {
  return (
    <span role="status" aria-label="FitX is thinking" className="flex items-center gap-1">
      {DOT_DELAYS.map((delay) => (
        <span key={delay} className={`size-1.5 animate-wave rounded-full bg-muted ${delay}`} />
      ))}
    </span>
  );
}
