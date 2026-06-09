import type { FitXAgentContext } from "../helpers/chat";
import { UserExercise } from "../db/models/UserExercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { db } from "../db";

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

    await db.transaction(async (trx) => {
      await UserExercise.query(trx).deleteById(userExerciseId);

      const remainingExercises = await UserExercise.query(trx)
        .where({ planDayId: exercise.planDayId })
        .orderBy("order");

      for (const [index, remainingExercise] of remainingExercises.entries()) {
        const order = index + 1;
        if (remainingExercise.order !== order) {
          await UserExercise.query(trx)
            .patch({ order })
            .where({ id: remainingExercise.id });
        }
      }
    });

    return { success: true };
  },
});
