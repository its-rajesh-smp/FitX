import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { UserPlan } from "../db/models/UserPlan";
import type { FitXAgentContext } from "../helpers/chat";

export const getPlanTool = tool({
  name: "getPlan",
  description:
    "Get the user's complete weekly workout plan sorted by ISO 8601 dayNumber from Monday (1) through Sunday (7). Exercises within each day are sorted by order. Always call this before any plan modification.",
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

    console.log(plan);

    emit({
      type: "status",
      status: "getting_plan",
      label: "Checking your plan",
    });

    return { exists: true, plan };
  },
});
