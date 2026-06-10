import { Agent } from "@openai/agents";
import { z } from "zod";
import { memoryLlmModel } from "../config/llm";
import {
  EXERCISE_EQUIPMENT,
  EXERCISE_LEVELS,
  EXERCISE_MUSCLES,
} from "../constants/exerciseFilters";

const userDetailsUpdateSchema = z.object({
  upserts: z.array(
    z.discriminatedUnion("key", [
      z.object({
        key: z.literal("experienceLevel"),
        value: z.enum(EXERCISE_LEVELS),
      }),
      z.object({
        key: z.literal("targetMuscles"),
        value: z.array(z.enum(EXERCISE_MUSCLES)),
      }),
      z.object({
        key: z.literal("availableEquipment"),
        value: z.array(z.enum(EXERCISE_EQUIPMENT)),
      }),
    ]),
  ),
  removals: z.array(
    z.enum(["experienceLevel", "targetMuscles", "availableEquipment"]),
  ),
});

export const userLongTermMemoryAgent = new Agent({
  name: "User Memory Agent",
  model: memoryLlmModel,
  outputType: userDetailsUpdateSchema,
  modelSettings: {
    temperature: 0.1,
  },
  instructions: `Extract long-term exercise setup preferences from the latest user message only.

Allowed keys:
- experienceLevel: one of ${EXERCISE_LEVELS.join(", ")}
- targetMuscles: array containing only ${EXERCISE_MUSCLES.join(", ")}
- availableEquipment: array containing only ${EXERCISE_EQUIPMENT.join(", ")}

Rules:
- Do not store name, pain, injuries, goals, age, weight, or any other facts.
- Never infer facts from assistant suggestions or existing details.
- Existing details are only context for corrections/removals.
- Map "Never really worked out before" to experienceLevel="beginner".
- Map "Worked out before, but not consistently (less than 6 months)" to experienceLevel="intermediate".
- Map "I work out regularly (6+ months)" to experienceLevel="expert".
- Ignore grouping prefixes like Full Body, Upper Body, Lower Body, Gym Access, and Workout On Home.
- Remove a key only when the user explicitly says it no longer applies.
- Return empty arrays when nothing should change.
`,
});
