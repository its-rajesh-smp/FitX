import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { PlanDay, UserExercise } from "../db/models";
import type { FitXAgentContext } from "../helpers/chat";

// ─────────────────────────────────────────────
// OPERATION SCHEMA (flat — no discriminatedUnion, OpenAI doesn't support oneOf)
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// SERVICE FUNCTIONS (temporary, move to services/ later)
// ─────────────────────────────────────────────

async function swapUserExercise(
  userId: string,
  input: {
    userExerciseId: string;
    newExerciseId: string;
    sets?: number;
    reps?: number;
    rest?: number;
  },
): Promise<void> {
  const { userExerciseId, newExerciseId, sets, reps, rest } = input;

  const updated = await UserExercise.update(userExerciseId, {
    exerciseId: newExerciseId,
    ...(sets !== undefined && { sets }),
    ...(reps !== undefined && { reps }),
    ...(rest !== undefined && { rest }),
  });

  if (!updated) {
    throw new Error(
      `SWAP_FAILED: userExerciseId "${userExerciseId}" not found`,
    );
  }
}

async function adjustUserExerciseVolume(
  userId: string,
  input: {
    userExerciseId: string;
    sets?: number;
    reps?: number;
    rest?: number;
  },
): Promise<void> {
  const { userExerciseId, sets, reps, rest } = input;

  if (sets === undefined && reps === undefined && rest === undefined) {
    throw new Error(
      "ADJUST_FAILED: At least one of sets, reps, or rest must be provided",
    );
  }

  const updated = await UserExercise.update(userExerciseId, {
    ...(sets !== undefined && { sets }),
    ...(reps !== undefined && { reps }),
    ...(rest !== undefined && { rest }),
  });

  if (!updated) {
    throw new Error(
      `ADJUST_FAILED: userExerciseId "${userExerciseId}" not found`,
    );
  }
}

async function addUserExercise(
  userId: string,
  input: {
    planDayId: string;
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
  },
): Promise<void> {
  const { planDayId, exerciseId, sets, reps, rest } = input;

  const existing = await UserExercise.query()
    .where({ planDayId })
    .orderBy("order");

  const alreadyExists = existing.some((ex) => ex.exerciseId === exerciseId);
  if (alreadyExists) {
    throw new Error(
      `ADD_FAILED: exerciseId "${exerciseId}" already exists on this day`,
    );
  }

  const nextOrder = existing.length + 1;

  await UserExercise.create({
    userId,
    planDayId,
    exerciseId,
    sets,
    reps,
    rest,
    order: nextOrder,
  });
}

async function removeUserExercise(
  userId: string,
  input: {
    userExerciseId: string;
  },
): Promise<void> {
  const { userExerciseId } = input;

  const userExercise = await UserExercise.findById(userExerciseId);
  if (!userExercise) {
    throw new Error(
      `REMOVE_FAILED: userExerciseId "${userExerciseId}" not found`,
    );
  }

  await UserExercise.query().deleteById(userExerciseId);

  // Reorder remaining to close the gap
  const remaining = await UserExercise.query()
    .where({ planDayId: userExercise.planDayId })
    .orderBy("order");

  await Promise.all(
    remaining.map((ex, index) =>
      UserExercise.update(ex.id, { order: index + 1 }),
    ),
  );
}

async function renameUserPlanDay(
  userId: string,
  input: {
    planDayId: string;
    label: string;
  },
): Promise<void> {
  const { planDayId, label } = input;

  const updated = await PlanDay.update(planDayId, { label });

  if (!updated) {
    throw new Error(`RENAME_FAILED: planDayId "${planDayId}" not found`);
  }
}

// ─────────────────────────────────────────────
// TOOL
// ─────────────────────────────────────────────

export const updatePlanTool = tool({
  name: "updatePlan",
  description: `
    Updates the user's existing workout plan.

    BEFORE CALLING:
    - Always call getPlan() first this turn to get current UUIDs (userExerciseId, planDayId).
    - For swap_exercise or add_exercise, always call getExercises() first to get valid exerciseId UUIDs.
    - Never use UUIDs from conversation history. Always re-fetch.

    OPERATIONS:
    - swap_exercise  : Replace an existing userExercise with a different exercise. Needs userExerciseId + newExerciseId.
    - adjust_volume  : Change sets, reps, or rest on an existing userExercise. Include only fields that are changing.
    - add_exercise   : Add a new exercise to a planDay. Needs planDayId + newExerciseId. sets, reps, rest are required.
    - remove_exercise: Remove a userExercise from a planDay. Needs userExerciseId.
    - rename_day     : Rename a planDay label without touching its exercises. Needs planDayId + label.

    RULES:
    - Never call this tool twice in the same turn.
    - After success, always return the user_plan widget.
  `,
  parameters: z.object({
    operations: z
      .array(operationSchema)
      .min(1)
      .describe(
        "List of operations to apply. Batch all changes into a single call.",
      ),
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
            await swapUserExercise(userId, {
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
            await adjustUserExerciseVolume(userId, {
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
            await addUserExercise(userId, {
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
            await removeUserExercise(userId, {
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
            await renameUserPlanDay(userId, {
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
