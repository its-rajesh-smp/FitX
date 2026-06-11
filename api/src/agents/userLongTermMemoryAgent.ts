import { Agent } from "@openai/agents";
import { z } from "zod";
import { llmModel } from "../config/llm";
import {
  EXERCISE_EQUIPMENT,
  EXERCISE_LEVELS,
  EXERCISE_MUSCLES,
} from "../constants/exerciseFilters";

const userDetailsUpdateSchema = z.object({
  experienceLevel: z
    .enum(EXERCISE_LEVELS)
    .optional()
    .describe(
      "Only set if the user explicitly states their own fitness experience level.",
    ),

  targetMuscles: z
    .array(z.enum(EXERCISE_MUSCLES))
    .optional()
    .describe(
      "Only set if the user explicitly states muscles they want to target.",
    ),

  availableEquipment: z
    .array(z.enum(EXERCISE_EQUIPMENT))
    .optional()
    .describe(
      "Only set if the user explicitly states equipment they have access to.",
    ),
});

export const userLongTermMemoryAgent = new Agent({
  name: "User Memory Agent",
  model: llmModel,
  outputType: userDetailsUpdateSchema,
  modelSettings: {
    temperature: 0.1,
  },
  instructions: `You extract ONLY facts explicitly stated by the user about themselves.

Do NOT extract values from:
- questions
- assistant messages
- suggestions
- examples
- options presented to the user
- negated statements

Examples:
"Are you beginner?" => {}
"Are you a beginner or intermediate?" => {}
"I am a beginner" => {"experienceLevel":"beginner"}
"I'm not a beginner" => {}
"I have dumbbells" => {"availableEquipment":["dumbbells"]}

Only output fields when the latest user message is an affirmative self-disclosure.`,
});
