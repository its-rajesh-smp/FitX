import { EXERCISE_MUSCLES } from "@/features/chat/constants/exerciseFilters";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

type Region = {
  id: string;
  muscles: string[];
  d: string;
};

const REGIONS: Region[] = [
  { id: "neck", muscles: ["neck"], d: "M70 47h20v18H70z" },
  {
    id: "shoulders",
    muscles: ["shoulders", "traps"],
    d: "m69 58-12 7-17 12 10 23 14-8h32l14 8 10-23-17-12-12-7z",
  },
  {
    id: "torso",
    muscles: ["chest", "lats", "middle back"],
    d: "M64 66h32v52H64z",
  },
  { id: "core", muscles: ["abdominals", "lower back"], d: "M64 116h32v45H64z" },
  {
    id: "arms",
    muscles: ["biceps", "triceps"],
    d: "M40 78l13 21-8 34-19-4 5-31zM120 78l-13 21 8 34 19-4-5-31z",
  },
  {
    id: "forearms",
    muscles: ["forearms"],
    d: "m26 127 19 4-6 35-18-4zM134 127l-19 4 6 35 18-4z",
  },
  {
    id: "hips",
    muscles: ["glutes", "abductors", "adductors"],
    d: "M62 159h36l7 34-25 15-25-15z",
  },
  {
    id: "thighs",
    muscles: ["quadriceps", "hamstrings", "abductors", "adductors"],
    d: "m56 190 24 16-8 46-24-2-2-25zM104 190l-24 16 8 46 24-2 2-25z",
  },
  {
    id: "calves",
    muscles: ["calves"],
    d: "m48 248 24 2 1 34-24-1zM112 248l-24 2-1 34 24-1z",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shapeClass(active: boolean) {
  return cn(
    "transition-all duration-300 stroke-[2] stroke-background",
    active ? "fill-primary" : "fill-muted",
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MuscleBodyMap({ selected }: { selected: readonly string[] }) {
  const isActive = (muscles: string[]) =>
    muscles.some((m) => selected.includes(m));

  const isFullBody = EXERCISE_MUSCLES.every((m) => selected.includes(m));

  return (
    <div className="relative mx-auto w-28 shrink-0 sm:w-32">
      <svg
        viewBox="0 0 160 300"
        role="img"
        aria-label="Body areas selected for training"
        className="h-auto w-full overflow-visible"
      >
        {/* Head */}
        <circle cx="80" cy="27" r="19" className={shapeClass(isFullBody)} />

        {/* Muscle regions */}
        {REGIONS.map(({ id, muscles, d }) => (
          <path key={id} d={d} className={shapeClass(isActive(muscles))} />
        ))}

        {/* Feet */}
        <path
          d="m49 281 24 1 3 11H39zM111 281l-24 1-3 11h37z"
          className={shapeClass(isFullBody)}
        />
      </svg>
    </div>
  );
}
