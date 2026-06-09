import type { FitXAgentContext } from "@helpers/chat";
import { Exercise } from "@models/Exercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

const exerciseFiltersSchema = z.object({
  level: z.enum(["beginner", "intermediate", "expert"]).nullable(),
  equipments: z.array(z.string()).max(5),
  muscles: z.array(z.string()).max(8),
  limit: z.number().int().min(1).max(30),
});

export const getExercisesTool = tool({
  name: "getExercises",
  description:
    "Get exercises from the FitX catalog using valid filters and optional user-provided name search terms.",
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
