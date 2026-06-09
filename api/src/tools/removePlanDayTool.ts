import type { FitXAgentContext } from "@helpers/chat";
import { PlanDay } from "@models/PlanDay";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { db } from "../db";

export const removePlanDayTool = tool({
  name: "removePlanDay",
  description:
    "Remove an entire workout day and all of its exercises from the user's plan. Call getPlan first to get a valid planDayId.",
  parameters: z.object({
    planDayId: z.string(),
  }),
  execute: async (
    { planDayId },
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

    await db.transaction(async (trx) => {
      await PlanDay.query(trx).deleteById(day.id);

      const remainingDays = await PlanDay.query(trx)
        .where({ userPlanId: day.userPlanId })
        .orderBy("order");

      for (const [index, remainingDay] of remainingDays.entries()) {
        const order = index + 1;
        if (remainingDay.order !== order) {
          await PlanDay.query(trx)
            .patch({ order })
            .where({ id: remainingDay.id });
        }
      }
    });

    return {
      success: true,
      removedDayName: day.name,
      remainingDays: await PlanDay.query()
        .where({ userPlanId: day.userPlanId })
        .resultSize(),
    };
  },
});
