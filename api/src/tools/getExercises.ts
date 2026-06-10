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
  level: z.enum(EXERCISE_LEVELS).nullable(),
  equipments: z.array(z.enum(EXERCISE_EQUIPMENT)).max(EXERCISE_EQUIPMENT.length),
  muscles: z.array(z.enum(EXERCISE_MUSCLES)).max(EXERCISE_MUSCLES.length),
  limit: z.number().int().min(1).max(30),
});

export const getExercisesTool = tool({
  name: "getExercises",
  description:
    "Get exercises from the FitX catalog. The parameter enums contain every valid level, equipment, and muscle filter; muscles match both primary and secondary muscles.",
  parameters: exerciseFiltersSchema,
  execute: async (
    { level, equipments, muscles, limit },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Finding exercises for you...",
    });

    console.log("Filters:", { level, equipments, muscles, limit });

    const exercises = await Exercise.findByFilters({
      ...(level && { level }),
      equipments,
      muscles,
      limit,
    });

    console.log("Exercises:", exercises.length);

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
