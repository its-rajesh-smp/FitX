import { useQuery } from "@tanstack/react-query";
import { searchExerciseVideos } from "@/features/program/services/searchExerciseVideos";

/** Fetches and caches exercise videos for a non-empty search query. */
export const useExerciseVideos = (query: string) =>
  useQuery({
    queryKey: ["exercise-videos", query],
    queryFn: () => searchExerciseVideos(query),
    enabled: Boolean(query),
    retry: false,
    staleTime: 1000 * 60 * 60,
  });
