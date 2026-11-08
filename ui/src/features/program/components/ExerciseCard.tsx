import {
  ArrowLeft,
  Check,
  ChevronRight,
  Dumbbell,
  LoaderCircle,
  Play,
  Timer,
  VideoOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExerciseVideos } from "@/features/program/hooks/useExerciseVideos";
import type { ProgramExercise } from "@/features/program/types/program";
import { cn } from "@/lib/utils";

// Pastel trios, not traffic lights.
const difficultyStyles = {
  beginner: "border-iris-edge bg-iris-tint text-iris-ink",
  intermediate: "border-peach-edge bg-peach-tint text-peach-ink",
  expert: "border-rose-edge bg-rose-tint text-rose-ink",
};

const getVideoSearchQuery = (exercise: ProgramExercise) =>
  `${exercise.exercise.name} exercise`;

export function ExerciseCard({
  exercise,
  onSelect,
}: {
  exercise: ProgramExercise;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group hover:bg-violet-tint/50 flex w-full items-center gap-3.5 border-b px-4 py-3.5 text-left transition-colors last:border-b-0 sm:px-5",
        exercise.isCompleted && "bg-violet-tint/40",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-white",
          exercise.isCompleted
            ? "border-accent-edge bg-accent-edge"
            : "border-input bg-white",
        )}
      >
        {exercise.isCompleted && <Check className="size-3" />}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-[14px] font-semibold",
            exercise.isCompleted && "text-muted-foreground line-through decoration-accent-deep",
          )}
        >
          {exercise.exercise.name}
        </p>
        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
          <span className="capitalize">
            {exercise.exercise.primaryMuscles.join(", ") || "Full body"}
          </span>
          <span className="text-foreground flex items-center gap-1 font-mono">
            <Dumbbell className="size-3 rotate-45" />
            {exercise.sets ?? "-"} × {exercise.reps ?? "-"}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Timer className="size-3" />
            {exercise.rest ? `${exercise.rest}s` : "as needed"}
          </span>
        </div>
      </div>
      <ChevronRight className="text-subtle size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

export function ExerciseDetail({
  exercise,
  isPending,
  onBack,
  onToggleCompleted,
}: {
  exercise: ProgramExercise;
  isPending: boolean;
  onBack: () => void;
  onToggleCompleted: () => void;
}) {
  const videoSearchQuery = getVideoSearchQuery(exercise);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    videoSearchQuery,
  )}`;
  const videos = useExerciseVideos(videoSearchQuery);
  const instructions = exercise.exercise.instructions ?? [];

  return (
    <div>
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground -ml-2 h-8 px-2.5 text-[13px]"
        onClick={onBack}
      >
        <ArrowLeft /> Back to workout
      </Button>

      <header className="mt-3">
        <p className="text-violet-ink font-mono text-[11px] tracking-[0.08em] uppercase">
          Exercise guide
        </p>
        <h1 className="mt-1 text-[26px] leading-tight font-normal tracking-[-0.03em] text-balance">
          {exercise.exercise.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-[13px] capitalize">
          {exercise.exercise.primaryMuscles.join(", ") || "Full body"}
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge
          className={cn(
            "border bg-white capitalize",
            difficultyStyles[
              exercise.exercise.level as keyof typeof difficultyStyles
            ],
          )}
        >
          {exercise.exercise.level ?? "All levels"}
        </Badge>
        <Badge className="bg-muted text-muted-foreground">
          <Dumbbell className="mr-1 size-3" />
          {exercise.exercise.equipment ?? "Body only"}
        </Badge>
        <Badge className="bg-muted text-muted-foreground font-mono">
          <Timer className="mr-1 size-3" />
          {exercise.sets ?? "-"} sets × {exercise.reps ?? "-"} reps
        </Badge>
      </div>

      <section className="shadow-card mt-6 rounded-2xl border bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">How to perform</h2>
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground inline-flex shrink-0 items-center gap-1.5 text-xs font-medium transition hover:text-red-600"
          >
            <Play className="size-3 fill-red-600 text-red-600" />
            Video guide
          </a>
        </div>
        {instructions.length ? (
          <ol className="text-muted-foreground mt-5 space-y-4 text-sm leading-6">
            {instructions.map((instruction, index) => (
              <li key={`${exercise.id}-${index}`} className="flex gap-3">
                <span className="bg-violet-tint text-violet-ink flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px]">
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm">
            No written instructions are available for this exercise.
          </p>
        )}
      </section>

      <section className="mt-6">
        <div>
          <h2 className="text-sm font-semibold">Watch how to perform</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            YouTube guides for “{videoSearchQuery}”
          </p>
        </div>

        {videos.isLoading && (
          <div className="text-muted-foreground shadow-card mt-4 flex min-h-48 items-center justify-center rounded-2xl border bg-white text-sm">
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Finding exercise guides...
          </div>
        )}

        {videos.isError && (
          <div className="shadow-card mt-4 rounded-2xl border bg-white p-8 text-center">
            <VideoOff className="text-muted-foreground mx-auto size-6" />
            <p className="mt-3 text-sm font-semibold">
              Embedded videos are not configured yet
            </p>
            <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-xs leading-5">
              Add a YouTube Data API key to load playable guides here. The
              existing Video guide link still works.
            </p>
          </div>
        )}

        {videos.data && videos.data.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {videos.data.map((video) => (
              <article
                key={video.id}
                className="shadow-card overflow-hidden rounded-2xl border bg-white"
              >
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                <div className="p-4">
                  <p className="line-clamp-2 text-xs leading-5 font-semibold">
                    {video.title}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {videos.data?.length === 0 && (
          <div className="text-muted-foreground shadow-card mt-4 rounded-2xl border bg-white p-8 text-center text-sm">
            No embeddable YouTube guides were found.
          </div>
        )}
      </section>

      <div className="mt-6 border-t pt-5">
        <Button
          variant={exercise.isCompleted ? "outline" : "default"}
          className="h-10 px-5"
          disabled={isPending}
          onClick={onToggleCompleted}
        >
          <Check />
          {exercise.isCompleted ? "Mark as not done" : "Mark as done"}
        </Button>
      </div>
    </div>
  );
}
