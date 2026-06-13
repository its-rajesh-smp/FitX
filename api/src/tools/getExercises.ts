import type { FitXAgentContext } from "../helpers/chat";
import {
  EXERCISE_EQUIPMENT,
  EXERCISE_LEVELS,
  EXERCISE_MUSCLES,
} from "../constants/exerciseFilters";
import { Exercise } from "../db/models/Exercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

const exerciseFiltersSchema = z.object({
  levels: z
    .array(z.enum(EXERCISE_LEVELS))
    .max(EXERCISE_LEVELS.length)
    .describe("Unique List of fitness levels to filter by."),
  equipments: z
    .array(z.enum(EXERCISE_EQUIPMENT))
    .max(EXERCISE_EQUIPMENT.length)
    .describe("Unique List of equipment to filter by."),
  muscles: z
    .array(z.enum(EXERCISE_MUSCLES))
    .max(EXERCISE_MUSCLES.length)
    .describe(
      "Unique List of muscles to filter by. Combination of primary muscles and secondary muscles.",
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(30)
    .describe("Maximum number of exercises to return. Use for pagination."),
  offset: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe("Number of exercises to skip. Use for pagination."),
});

export const getExercisesTool = tool({
  name: "getExercisesTool",
  description: `This tool is used to get a list of exercises based on the provided filters.`,
  parameters: exerciseFiltersSchema,
  execute: async (
    { levels, equipments, muscles, limit },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Finding exercises for you",
    });

    // console.log(
    //   `Getting exercises for levels: ${levels}, equipments: ${equipments}, muscles: ${muscles}, limit: ${limit}`,
    // );

    const exercises = await Exercise.findByFilters({
      levels,
      equipments,
      muscles,
      limit,
    });

    // console.log("Exercises found:");
    // console.log(exercises);

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: `Found ${exercises.length} exercises`,
    });

    return {
      count: exercises.length,
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        level: exercise.level,
        equipment: exercise.equipment,
        primaryMuscles: exercise.primaryMuscles,
        secondaryMuscles: exercise.secondaryMuscles,
        // instructions: exercise.instructions,
      })),
    };
  },
});
