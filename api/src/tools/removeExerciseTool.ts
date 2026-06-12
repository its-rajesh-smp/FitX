import type { FitXAgentContext } from "../helpers/chat";
import { UserExercise } from "../db/models/UserExercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { db } from "../db";
export const removeExerciseTool = tool({
  name: "removeExercise",
  description: `Remove one or more exercises from the user's plan. 
  Call getPlan first to get valid userExerciseId values.
  
IMPORTANT:
- Make sure to check the complete plan before updating any exercise.
- Make sure to check if the plan day label update is required after removing the exercise.
  `,
  parameters: z.object({
    userExerciseIds: z.array(z.string()).min(1),
  }),
  execute: async (
    { userExerciseIds },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    const { userId, emit } = runContext.context;

    emit({
      type: "status",
      status: "updating_plan",
      label: "Updating your workout plan",
    });

    await db.transaction(async (trx) => {
      const exercisesToRemove = await UserExercise.query(trx)
        .whereIn("id", userExerciseIds)
        .where({ userId });

      if (exercisesToRemove.length !== userExerciseIds.length) {
        throw new Error("INVALID_USER_EXERCISE_ID");
      }

      const affectedPlanDayIds = [
        ...new Set(exercisesToRemove.map((exercise) => exercise.planDayId)),
      ];

      await UserExercise.query(trx)
        .delete()
        .whereIn("id", userExerciseIds)
        .where({ userId });

      for (const planDayId of affectedPlanDayIds) {
        const remainingExercises = await UserExercise.query(trx)
          .where({ userId, planDayId })
          .orderBy("order");

        for (const [index, remainingExercise] of remainingExercises.entries()) {
          const order = index + 1;

          if (remainingExercise.order !== order) {
            await UserExercise.query(trx)
              .patch({ order })
              .where({ id: remainingExercise.id, userId });
          }
        }
      }
    });

    return { success: true };
  },
});
