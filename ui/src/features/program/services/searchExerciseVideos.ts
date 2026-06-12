import { api, type ApiEnvelope } from "@/libs/api";

export interface ExerciseVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string | null;
}

export const searchExerciseVideos = async (
  query: string,
): Promise<ExerciseVideo[]> => {
  const response = await api.get<ApiEnvelope<ExerciseVideo[]>>(
    "/videos/search",
    { params: { q: query } },
  );

  return response.data.data;
};
