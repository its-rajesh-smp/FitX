import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { PlanDay, UserExercise } from "../db/models";
import type { FitXAgentContext } from "../helpers/chat";

// OPERATION SCHEMA (flat — no discriminatedUnion, OpenAI doesn't support oneOf)
const operationSchema = z.object({
  type: z
    .enum([
      "swap_exercise",
      "adjust_volume",
      "add_exercise",
      "remove_exercise",
      "rename_day",
    ])
    .describe(
      "The type of operation to perform. Each type requires specific fields — see field descriptions.",
    ),

  // Required for: swap_exercise, adjust_volume, remove_exercise
  userExerciseId: z
    .string()
    .optional()
    .describe(
      "UUID of the userExercise row. Required for: swap_exercise, adjust_volume, remove_exercise. Must come from getPlan() called this turn.",
    ),

  // Required for: swap_exercise, add_exercise
  newExerciseId: z
    .string()
    .optional()
    .describe(
      "UUID of the exercise. Required for: swap_exercise (replacement), add_exercise (new exercise). Must come from getExercises() called this turn.",
    ),

  // Required for: add_exercise, rename_day
  planDayId: z
    .string()
    .optional()
    .describe(
      "UUID of the planDay. Required for: add_exercise, rename_day. Must come from getPlan() called this turn.",
    ),

  // Required for: rename_day
  label: z
    .string()
    .optional()
    .describe(
      "New descriptive label for the day. Required for: rename_day. e.g. 'Push Day', 'Upper Body Strength'.",
    ),

  // Required for: add_exercise. Optional for: swap_exercise, adjust_volume
  sets: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(
      "Number of sets. Required for: add_exercise. Optional override for: swap_exercise, adjust_volume (omit to keep existing value).",
    ),

  // Required for: add_exercise. Optional for: swap_exercise, adjust_volume
  reps: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(
      "Number of reps. Required for: add_exercise. Optional override for: swap_exercise, adjust_volume (omit to keep existing value).",
    ),

  // Required for: add_exercise. Optional for: swap_exercise, adjust_volume
  rest: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(
      "Rest in seconds. Required for: add_exercise. Optional override for: swap_exercise, adjust_volume (omit to keep existing value).",
    ),

  reason: z.string().describe("Why you are doing this?"),
});

export const updatePlanTool = tool({
  name: "updateWorkoutPlanTool",
  description: `This tool is used to update the user's existing workout plan.

    ACTIONS:
    - swap_exercise  : Replace an existing userExercise with a different exercise. Needs userExerciseId + newExerciseId.
    - adjust_volume  : Change sets, reps, or rest on an existing userExercise. Include only fields that are changing.
    - add_exercise   : Add a new exercise to a planDay. Needs planDayId + newExerciseId. sets, reps, rest are required.
    - remove_exercise: Remove a userExercise from a planDay. Needs userExerciseId.
    - rename_day     : Rename a planDay label without touching its exercises. Needs planDayId + label.

    IMPORTANT:
    - Never call this tool multiple times instead use batch operations to update the user's workout plan in a single call.
  `,
  parameters: z.object({
    operations: z
      .array(operationSchema)
      .min(1)
      .describe("List of actions to perform"),
  }),
  execute: async (
    { operations },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");
    const { userId, emit } = runContext.context;

    emit({
      type: "status",
      status: "updating_plan",
      label: "Updating your workout plan",
    });

    const errors: Array<{ index: number; type: string; reason: string }> = [];

    for (const [index, operation] of operations.entries()) {
      try {
        switch (operation.type) {
          case "swap_exercise": {
            if (!operation.userExerciseId || !operation.newExerciseId) {
              throw new Error(
                "SWAP_FAILED: userExerciseId and newExerciseId are required",
              );
            }
            emit({
              type: "status",
              status: "updating_plan",
              label: "Swapping exercise",
            });
            await UserExercise.swapUserExercise(userId, {
              userExerciseId: operation.userExerciseId,
              newExerciseId: operation.newExerciseId,
              sets: operation.sets,
              reps: operation.reps,
              rest: operation.rest,
            });
            break;
          }

          case "adjust_volume": {
            if (!operation.userExerciseId) {
              throw new Error("ADJUST_FAILED: userExerciseId is required");
            }
            emit({
              type: "status",
              status: "updating_plan",
              label: "Adjusting sets, reps and rest",
            });
            await UserExercise.adjustUserExerciseVolume(userId, {
              userExerciseId: operation.userExerciseId,
              sets: operation.sets,
              reps: operation.reps,
              rest: operation.rest,
            });
            break;
          }

          case "add_exercise": {
            if (
              !operation.planDayId ||
              !operation.newExerciseId ||
              !operation.sets ||
              !operation.reps ||
              !operation.rest
            ) {
              throw new Error(
                "ADD_FAILED: planDayId, newExerciseId, sets, reps and rest are required",
              );
            }
            emit({
              type: "status",
              status: "updating_plan",
              label: "Adding exercise to your plan",
            });
            await UserExercise.addUserExercise(userId, {
              planDayId: operation.planDayId,
              exerciseId: operation.newExerciseId,
              sets: operation.sets,
              reps: operation.reps,
              rest: operation.rest,
            });
            break;
          }

          case "remove_exercise": {
            if (!operation.userExerciseId) {
              throw new Error("REMOVE_FAILED: userExerciseId is required");
            }
            emit({
              type: "status",
              status: "updating_plan",
              label: "Removing exercise from your plan",
            });
            await UserExercise.removeUserExercise(userId, {
              userExerciseId: operation.userExerciseId,
            });
            break;
          }

          case "rename_day": {
            if (!operation.planDayId || !operation.label) {
              throw new Error(
                "RENAME_FAILED: planDayId and label are required",
              );
            }
            emit({
              type: "status",
              status: "updating_plan",
              label: "Renaming workout day",
            });
            await PlanDay.renameUserPlanDay(userId, {
              planDayId: operation.planDayId,
              label: operation.label,
            });
            break;
          }
        }
      } catch (error) {
        errors.push({
          index,
          type: operation.type,
          reason: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      updatedOperations: operations.length,
    };
  },
});
