import { Agent } from "@openai/agents";
import { z } from "zod";
import { llmModel } from "../config/llm";
import { FitXAgentContext } from "../helpers/chat";
import {
  createPlanTool,
  getExerciseDetailTool,
  getExercisesTool,
  getPlanTool,
  removeExerciseTool,
  updateExerciseTool,
} from "../tools";
import { chatAgentPrompt } from "./prompts/chatAgentPrompt";

const chatWidgetSchema = z.object({
  type: z.enum([
    "none",
    "experience_level",
    "muscle_multi_select",
    "equipment_multi_select",
    "user_plan",
  ]),
  label: z.string().min(1).max(50),
});

export const chatAgentResponseSchema = z.object({
  text: z.string().min(1).max(3000),
  quickAnswers: z.array(z.string().min(1).max(100)).max(4),
  widget: chatWidgetSchema,
});

export const fitXChatAgent = new Agent<
  FitXAgentContext,
  typeof chatAgentResponseSchema
>({
  name: "FitX Trainer",
  model: llmModel,
  outputType: chatAgentResponseSchema,
  modelSettings: {
    temperature: 0.5,
  },
  tools: [
    getExercisesTool,
    createPlanTool,
    removeExerciseTool,
    updateExerciseTool,
    // updatePlanDayTool,
    // addExerciseTool,
    getPlanTool,
    getExerciseDetailTool,
  ],
  instructions: chatAgentPrompt,
});
