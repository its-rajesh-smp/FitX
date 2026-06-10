import type { FitXAgentContext } from "../helpers/chat";
import { PlanDay } from "../db/models/PlanDay";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

export const updatePlanDayTool = tool({
  name: "updatePlanDay",
  description:
    "Update an existing workout day's meaningful name. Call getPlan first to get a valid planDayId.",
  parameters: z.object({
    planDayId: z.string(),
    name: z
      .string()
      .min(1)
      .max(100)
      .refine((name) => !/^day\s*\d+(?:\s*-\s*day\s*\d+)?$/i.test(name.trim()), {
        message: "Use a meaningful workout name, not a generic day label.",
      })
      .optional(),
  }),
  execute: async (
    { planDayId, name },
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

    if (name === undefined) {
      return { error: "No workout day changes were provided." };
    }

    const updated = await PlanDay.update(planDayId, {
      name,
    });

    return { success: true, updated };
  },
});
