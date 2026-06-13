import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { UserPlan } from "../db/models/UserPlan";
import type { FitXAgentContext } from "../helpers/chat";

export const getPlanTool = tool({
  name: "getWorkoutPlanTool",
  description: "This tool is use to get the user's current workout plan.",
  parameters: z.object({}),
  execute: async (_, runContext?: RunContext<FitXAgentContext>) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    const { userId, emit } = runContext.context;

    emit({
      type: "status",
      status: "getting_plan",
      label: "Getting your workout plan",
    });

    const plan = await UserPlan.findByUserIdWithDetails(userId);

    if (!plan) return { exists: false };

    emit({
      type: "status",
      status: "getting_plan",
      label: "Checking your plan",
    });

    return { exists: true, plan };
  },
});
