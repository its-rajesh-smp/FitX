import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleProgramExercise } from "@/features/program/services/toggleProgramExercise";

/** Toggles exercise completion and refreshes the cached workout program. */
export const useToggleProgramExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleProgramExercise,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["program"] }),
  });
};
