import { RunContext, tool } from "@openai/agents";
import z from "zod";
import { Exercise } from "../db/models";
import { FitXAgentContext } from "../helpers/chat";

export const getExerciseDetailTool = tool({
  name: "getExerciseDetail",
  description: `Get full details including instructions for a single exercise. 

IMPORTANT
- Call this only when the user asks about a specific exercise.
- DO NOT call this for each exercise in the plan.
`,
  parameters: z.object({
    exerciseId: z.string(),
  }),
  execute: async (
    { exerciseId },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Finding exercise details",
    });

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) return { error: "This exercise not found in our dataset" };

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Got the exercise details",
    });

    return {
      name: exercise.name,
      level: exercise.level,
      equipment: exercise.equipment,
      primaryMuscles: exercise.primaryMuscles,
      secondaryMuscles: exercise.secondaryMuscles,
      instructions: exercise.instructions,
    };
  },
});
