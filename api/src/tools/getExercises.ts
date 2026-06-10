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
    .refine((levels) => new Set(levels).size === levels.length, {
      message: "Exercise levels must be unique.",
    }),
  equipments: z
    .array(z.enum(EXERCISE_EQUIPMENT))
    .max(EXERCISE_EQUIPMENT.length),
  muscles: z.array(z.enum(EXERCISE_MUSCLES)).max(EXERCISE_MUSCLES.length),
  limit: z.number().int().min(1).max(30),
});

export const getExercisesTool = tool({
  name: "getExercises",
  description:
    "Get exercises from the FitX catalog. Use levels=[beginner] for beginner users, levels=[beginner, intermediate] for intermediate users, and levels=[beginner, intermediate, expert] for expert users. An empty levels array disables level filtering. The parameter enums contain every valid level, equipment, and muscle filter; muscles match both primary and secondary muscles.",
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

    const exercises = await Exercise.findByFilters({
      levels,
      equipments,
      muscles,
      limit,
    });

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
        instructions: exercise.instructions,
      })),
    };
  },
});
