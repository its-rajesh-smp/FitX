import { EXERCISE_MUSCLES } from "@/features/chat/constants/exerciseFilters";
import { cn } from "@/lib/utils";

const MUSCLE_REGIONS = {
  neck: ["neck"],
  shoulders: ["shoulders", "traps"],
  torso: ["chest", "lats", "middle back"],
  arms: ["biceps", "triceps"],
  forearms: ["forearms"],
  core: ["abdominals", "lower back"],
  hips: ["glutes", "abductors", "adductors"],
  thighs: ["quadriceps", "hamstrings", "abductors", "adductors"],
  calves: ["calves"],
} as const;

export function MuscleBodyMap({ selected }: { selected: readonly string[] }) {
  const isFullBody = EXERCISE_MUSCLES.every((muscle) =>
    selected.includes(muscle),
  );
  const isActive = (region: keyof typeof MUSCLE_REGIONS) =>
    MUSCLE_REGIONS[region].some((muscle) => selected.includes(muscle));
  const extremityClass = cn(
    "fill-muted stroke-muted-foreground/20 transition-all duration-300",
    isFullBody && "fill-primary stroke-primary",
  );
  const extremityGlow = isFullBody
    ? { filter: "drop-shadow(0 0 6px var(--primary))" }
    : undefined;
  const regionClass = (region: keyof typeof MUSCLE_REGIONS) =>
    cn(
      "fill-muted stroke-muted-foreground/20 transition-all duration-300",
      isActive(region) && "fill-primary stroke-primary",
    );
  const glow = (region: keyof typeof MUSCLE_REGIONS) =>
    isActive(region)
      ? { filter: "drop-shadow(0 0 6px var(--primary))" }
      : undefined;

  return (
    <div className="relative mx-auto w-28 shrink-0 sm:w-32">
      <svg
        viewBox="0 0 160 300"
        role="img"
        aria-label="Body areas selected for training"
        className="h-auto w-full overflow-visible"
      >
        <circle
          cx="80"
          cy="27"
          r="19"
          className={extremityClass}
          style={extremityGlow}
        />
        <path
          d="M70 47h20v18H70z"
          className={regionClass("neck")}
          style={glow("neck")}
        />
        <path
          d="m69 58-12 7-17 12 10 23 14-8h32l14 8 10-23-17-12-12-7z"
          className={regionClass("shoulders")}
          style={glow("shoulders")}
        />
        <path
          d="M64 66h32v52H64z"
          className={regionClass("torso")}
          style={glow("torso")}
        />
        <path
          d="M64 116h32v45H64z"
          className={regionClass("core")}
          style={glow("core")}
        />
        <path
          d="M40 78l13 21-8 34-19-4 5-31zM120 78l-13 21 8 34 19-4-5-31z"
          className={regionClass("arms")}
          style={glow("arms")}
        />
        <path
          d="m26 127 19 4-6 35-18-4zM134 127l-19 4 6 35 18-4z"
          className={regionClass("forearms")}
          style={glow("forearms")}
        />
        <path
          d="M62 159h36l7 34-25 15-25-15z"
          className={regionClass("hips")}
          style={glow("hips")}
        />
        <path
          d="m56 190 24 16-8 46-24-2-2-25zM104 190l-24 16 8 46 24-2 2-25z"
          className={regionClass("thighs")}
          style={glow("thighs")}
        />
        <path
          d="m48 248 24 2 1 34-24-1zM112 248l-24 2-1 34 24-1z"
          className={regionClass("calves")}
          style={glow("calves")}
        />
        <path
          d="m49 281 24 1 3 11H39zM111 281l-24 1-3 11h37z"
          className={extremityClass}
          style={extremityGlow}
        />
      </svg>
    </div>
  );
}
