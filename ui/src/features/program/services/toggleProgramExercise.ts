import { api, type ApiEnvelope } from "@/libs/api";
import type { ProgramExercise } from "@/features/program/types/program";

export const toggleProgramExercise = async (
  userExerciseId: string,
): Promise<ProgramExercise> => {
  const response = await api.patch<ApiEnvelope<ProgramExercise>>(
    `/plans/exercises/${userExerciseId}/toggle`,
  );
  return response.data.data;
};
