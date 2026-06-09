import type { FitXAgentContext } from "@helpers/chat";
import { PlanDay } from "@models/PlanDay";
import { UserExercise } from "@models/UserExercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

export const addExerciseTool = tool({
  name: "addExercise",
  description:
    "Add an exercise to a specific plan day. Call getPlan first to get valid planDayId values.",
  parameters: z.object({
    planDayId: z.string(),
    exerciseId: z.string(),
    sets: z.number().int().positive().nullable(),
    reps: z.number().int().positive().nullable(),
    rest: z.number().int().positive().nullable(), // seconds
  }),
  execute: async (
    { planDayId, exerciseId, sets, reps, rest },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");
    const { userId, emit } = runContext.context;

    emit({
      type: "status",
      status: "updating_plan",
      label: "Updating your workout plan",
    });

    const day = await PlanDay.findById(planDayId);
    if (!day || day.userId !== userId) {
      return { error: "Plan day not found or does not belong to user." };
    }

    const order =
      (await UserExercise.query().where({ planDayId }).max("order as order").first())
        ?.order ?? 0;

    const created = await UserExercise.create({
      userId,
      planDayId,
      exerciseId,
      sets,
      reps,
      rest,
      isCompleted: false,
      order: Number(order) + 1,
    });

    return { success: true, userExerciseId: created.id };
  },
});
