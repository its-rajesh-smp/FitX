import { Agent } from "@openai/agents";
import { z } from "zod";
import { memoryLlmModel } from "../config/llm";
import {
  EXERCISE_EQUIPMENT,
  EXERCISE_LEVELS,
  EXERCISE_MUSCLES,
} from "../constants/exerciseFilters";

const userDetailsUpdateSchema = z.object({
  experienceLevel: z
    .enum(EXERCISE_LEVELS)
    .optional()
    .describe("User's fitness experience level."),
  targetMuscles: z
    .array(z.enum(EXERCISE_MUSCLES))
    .optional()
    .describe("Muscles the user wants to target and exercise."),
  availableEquipment: z
    .array(z.enum(EXERCISE_EQUIPMENT))
    .optional()
    .describe("Equipment the user has access to."),
});

export const userLongTermMemoryAgent = new Agent({
  name: "User Memory Agent",
  model: memoryLlmModel,
  outputType: userDetailsUpdateSchema,
  modelSettings: {
    temperature: 0.5,
  },
  instructions: `Extract long-term exercise setup preferences from the latest user message only.

Return only fields that are explicitly mentioned in the latest user message.

Extract:
- experienceLevel
- targetMuscles
- availableEquipment

Rules:
- Do not infer.
- Do not use assistant suggestions.
- Existing details are only context.
- If nothing should change, return {}.
- If the user updates a field, return the complete new value for that field.
`,
});
