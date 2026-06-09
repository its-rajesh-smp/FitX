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
