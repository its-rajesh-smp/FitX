import { RunContext, tool } from "@openai/agents";
import z from "zod";
import { Exercise } from "../db/models";
import { FitXAgentContext } from "../helpers/chat";

export const getExerciseDetailTool = tool({
  name: "getExerciseDetailsTool",
  description: `This tool is use to search one specific exercise from the exercise database by exerciseId or name.`,
  parameters: z.object({
    exerciseId: z.string().optional(),
    name: z.string().optional(),
  }),
  execute: async (
    { exerciseId, name },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Finding exercise details",
    });

    if (exerciseId) {
      const exercise = await Exercise.findById(exerciseId);

      if (exercise) {
        runContext.context.emit({
          type: "status",
          status: "getting_exercises",
          label: "Found exercise details",
        });
        return { success: true, exercise };
      }
    }

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Finding matching exercises",
    });

    const exercises = await Exercise.search({ name, id: exerciseId });

    if (!exercises.length) return { error: "Any matching exercises not found" };

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: `Found ${exercises.length} matching exercises`,
    });

    return {
      success: true,
      matches: exercises,
    };
  },
});
