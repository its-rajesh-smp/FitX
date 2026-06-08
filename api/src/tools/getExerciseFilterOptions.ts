import { Exercise } from "@models/Exercise";
import { tool } from "@openai/agents";
import { z } from "zod";

export const getExerciseFilterOptionsTool = tool({
  name: "getExerciseFilterOptions",
  description:
    "Get the valid levels, equipment, and muscles available in the FitX exercise catalog. Call this before getExercises when choosing exercise filters.",
  parameters: z.object({}),
  execute: async () => {
    return await Exercise.getFilterOptions();
  },
});
