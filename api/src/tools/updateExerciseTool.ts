import type { FitXAgentContext } from "../helpers/chat";
import { UserExercise } from "../db/models/UserExercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

export const updateExerciseTool = tool({
  name: "updateExercise",
  description:
    "Update sets, reps, or rest of an exercise in the user's plan. Call getPlan first to get valid userExerciseId values.",
  parameters: z.object({
    userExerciseId: z.string(),
    sets: z.number().int().positive().nullable().optional(),
    reps: z.number().int().positive().nullable().optional(),
    rest: z.number().int().positive().nullable().optional(),
  }),
  execute: async (
    { userExerciseId, sets, reps, rest },
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

    const updated = await UserExercise.update(userExerciseId, {
      ...(sets !== undefined && { sets }),
      ...(reps !== undefined && { reps }),
      ...(rest !== undefined && { rest }),
    });

    return { success: true, updated };
  },
});
