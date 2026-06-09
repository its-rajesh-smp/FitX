import type { FitXAgentContext } from "@helpers/chat";
import { Exercise } from "@models/Exercise";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

const exerciseFiltersSchema = z.object({
  level: z.enum(["beginner", "intermediate", "expert"]).nullable(),
  equipments: z.array(z.string()).max(5),
  muscles: z.array(z.string()).max(8),
  searchTerms: z.array(z.string()).max(5),
  limit: z.number().int().min(1).max(8),
});

export const getExercisesTool = tool({
  name: "getExercises",
  description:
    "Get exercises from the FitX catalog using valid filters and optional user-provided name search terms.",
  parameters: exerciseFiltersSchema,
  execute: async (
    { level, equipments, muscles, searchTerms, limit },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Getting exercises",
    });

    const options = await Exercise.getFilterOptions();
    const invalidEquipments = equipments.filter(
      (equipment) => !options.equipments.includes(equipment),
    );
    const invalidMuscles = muscles.filter(
      (muscle) => !options.muscles.includes(muscle),
    );

    if (invalidEquipments.length || invalidMuscles.length) {
      return {
        error: "Invalid exercise filters",
        invalidEquipments,
        invalidMuscles,
        instruction:
          "Call getExerciseFilterOptions and retry with valid filter values.",
      };
    }

    const exercises = await Exercise.findByFilters({
      ...(level && { level }),
      equipments,
      muscles,
      searchTerms,
      limit,
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
        instructions: exercise.instructions.slice(0, 4),
      })),
    };
  },
});
