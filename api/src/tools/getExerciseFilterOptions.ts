import type { FitXAgentContext } from "../helpers/chat";
import { Exercise } from "../db/models/Exercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

export const getExerciseFilterOptionsTool = tool({
  name: "getExerciseFilterOptions",
  description:
    "Get the valid levels, equipment, and muscles available in the exercise catalog. Call this before getExercises when choosing exercise filters.",
  parameters: z.object({}),
  execute: async (_, runContext?: RunContext<FitXAgentContext>) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    runContext.context.emit({
      type: "status",
      status: "getting_options",
      label: "Getting exercise options",
    });

    return await Exercise.getFilterOptions();
  },
});
