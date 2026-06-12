import { Agent } from "@openai/agents";
import { z } from "zod";
import { llmModel } from "../config/llm";
import { FitXAgentContext } from "../helpers/chat";
import {
  createPlanTool,
  getExerciseDetailTool,
  getExercisesTool,
  getPlanTool,
} from "../tools";
import { chatAgentPrompt } from "./prompts/chatAgentPrompt";

const chatWidgetSchema = z.object({
  type: z
    .enum([
      "none",
      "experience_level",
      "muscle_multi_select",
      "equipment_multi_select",
      "user_plan",
    ])
    .default("none")
    .describe("The type of widget to display."),
  label: z
    .string()
    .min(1)
    .max(30)
    .describe("The meaningful label for the widget to show as a title."),
});

export const chatAgentResponseSchema = z.object({
  text: z.string().min(1).max(3000),
  quickAnswers: z
    .array(z.string().min(1).max(30))
    .max(4)
    .describe(
      "The meaningful predictions to show as quick answers. Used to reduce user typing effort by providing concise response suggestions.",
    ),
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
    getPlanTool,
    getExerciseDetailTool,
    // removeExerciseTool,
    // updateExerciseTool,
    // updatePlanDayTool,
    // addExerciseTool,
  ],
  instructions: chatAgentPrompt,
});
