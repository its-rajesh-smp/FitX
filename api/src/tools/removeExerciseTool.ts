import type { FitXAgentContext } from "@helpers/chat";
import { UserExercise } from "@models/UserExercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

export const removeExerciseTool = tool({
  name: "removeExercise",
  description:
    "Remove an exercise from the user's plan. Call getPlan first to get valid userExerciseId values.",
  parameters: z.object({
    userExerciseId: z.string(),
  }),
  execute: async (
    { userExerciseId },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");
    const { userId, emit } = runContext.context;

    emit({
      type: "status",
      status: "updating_plan",
      label: "Updating your workout plan",
    });

    const exercise = await UserExercise.findById(userExerciseId);
    if (!exercise || exercise.userId !== userId) {
      return { error: "Exercise not found or does not belong to user." };
    }

    await UserExercise.query().deleteById(userExerciseId);
    return { success: true };
  },
});
