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
      "Set when the user explicitly states that the workout subject has a fitness level or has never worked out. The subject may be the user or someone they are creating a plan for.",
    ),

  targetMuscles: z
    .array(z.enum(EXERCISE_MUSCLES))
    .optional()
    .describe(
      "Set when the user explicitly states target muscles for the workout subject.",
    ),

  availableEquipment: z
    .array(z.enum(EXERCISE_EQUIPMENT))
    .optional()
    .describe(
      "Set when the user explicitly states equipment available to the workout subject.",
    ),
});

export const userLongTermMemoryAgent = new Agent({
  name: "User Memory Agent",
  model: llmModel,
  outputType: userDetailsUpdateSchema,
  modelSettings: {
    temperature: 0.5,
  },
  instructions: `You extract ONLY facts explicitly stated by the user about themselves or their relatives.

Examples:
"Are you beginner?" => {}
"Are you a beginner or intermediate?" => {}
"I am a beginner" => {"experienceLevel":"beginner"}
"I'm not a beginner" => {}
"I have dumbbells" => {"availableEquipment":["dumbbells"]}
"My dad has dumbbells and he is a beginner" => {"availableEquipment":["dumbbells"], "experienceLevel":"beginner"}
"I have dumbbells and I am a beginner" => {"availableEquipment":["dumbbells"], "experienceLevel":"beginner"}
"My dad have no experience in fitness" => {"experienceLevel":"beginner"}
"I am creating some workout plan for someone. He is a beginner" => {"experienceLevel":"beginner"}

Only output fields when the latest user message explicitly provides information about the user or the workout subject.

## IMPORTANT:
1. You will get the user's message from the conversation and current user details. NEVER remove anything from the memory unless you feel that user wants to update it.
2. Here user is the person who is creating a workout plan or the person for whom the plan is being created.

Examples:
User message: "Are you a beginner?" 
Current user details: {}
Output: {}
Reasoning: User is asking the AI.

User message: "You know i mate with a guy who is a fitness expert" 
Current user details: {}
Output: {}
Reasoning: User is talking about a fitness expert.

User message: "I am a beginner" 
Current user details: {"experienceLevel":"beginner"}
Output: {"experienceLevel":"beginner"}
Reasoning: User stated that he is beginner.

User message: "I have dumbbells" 
Current user details: {"availableEquipment":["dumbbells"]}
Output: {"availableEquipment":["dumbbells"], "experienceLevel":"beginner"}
Reasoning: User stated that he has dumbbells.

User message: "I have no other equipment" 
Current user details:  {"availableEquipment":["dumbbells"], "experienceLevel":"beginner"}
Output: {"availableEquipment":["dumbbells"], "experienceLevel":"beginner"}
Reasoning: User stated that he has no other equipment.

User message: "I have exercise ball" 
Current user details:  {"availableEquipment":["dumbbells"], "experienceLevel":"beginner"}
Output: {"availableEquipment":["dumbbells", "exercise ball"], "experienceLevel":"beginner"}
Reasoning: User stated that he has exercise ball too. 

User message: "Ohh, sorry i don't have any dumbbells" 
Current user details:  {"availableEquipment":["dumbbells", "exercise ball"], "experienceLevel":"beginner"}
Output: {"availableEquipment":["exercise ball"], "experienceLevel":"beginner"}
Reasoning: User stated that he has no dumbbells.

User message: "Ohh, sorry my dad have some dumbbells" 
Current user details:  {"availableEquipment":["dumbbells", "exercise ball"], "experienceLevel":"beginner"}
Output: {"availableEquipment":["exercise ball", "dumbbells"], "experienceLevel":"beginner"}
Reasoning: User stated that his relative has dumbbells.
`,
});
