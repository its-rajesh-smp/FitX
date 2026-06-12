import type { FitXAgentContext } from "../helpers/chat";
import { PlanDay } from "../db/models/PlanDay";
import { UserExercise } from "../db/models/UserExercise";
import { UserPlan } from "../db/models/UserPlan";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { db } from "../db";

const exerciseInputSchema = z.object({
  exerciseId: z
    .string()
    .describe(
      "The exact exercise id. Get this from the getExercises tool. DO not create by your own.",
    ),
  sets: z.number().int().positive().nullable(),
  reps: z.number().int().positive().nullable(),
  rest: z.number().int().positive().nullable(), // seconds
});

const dayInputSchema = z.object({
  dayNumber: z
    .number()
    .int()
    .min(1)
    .max(7)
    .describe(
      "ISO 8601 day number from 1 to 7. Where 1 is Monday, 2 is Tuesday, 3 is Wednesday, 4 is Thursday, 5 is Friday, 6 is Saturday, 7 is Sunday.",
    ),
  label: z
    .string()
    .min(1)
    .max(100)
    .refine((label) => !/^day\s*\d+(?:\s*-\s*day\s*\d+)?$/i.test(label.trim()), {
      message: "Use a meaningful workout label, not a generic day label.",
    }),
  exercises: z.array(exerciseInputSchema).max(12),
});

const planDaysInputSchema = z.array(dayInputSchema).length(7);

export const createPlanTool = tool({
  name: "createPlan",
  description: `Create a new seven-day weekly workout plan.

BEFORE CALLING THIS TOOL:
- Always call getExercises() first to get valid exercise IDs.
- Never use all exercises returned. Pick only what fits the user's level and weekly structure.
- Never invent or reuse exercise IDs from memory.

IMPORTANT:
dayNumber must use ISO 8601 weekday numbering from 1 through 7.
Where
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
7 = Sunday
  `,
  parameters: z.object({
    days: planDaysInputSchema,
  }),
  execute: async ({ days }, runContext?: RunContext<FitXAgentContext>) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    const { userId, emit } = runContext.context;

    emit({
      type: "status",
      status: "generating_plan",
      label: "Creating your workout plan",
    });

    const plan = await db.transaction(async (trx) => {
      const existing = await UserPlan.query(trx).findOne({ userId });

      if (existing) {
        await PlanDay.deleteByPlanId(existing.id, trx);
        await UserPlan.query(trx).deleteById(existing.id);
      }

      const createdPlan = await UserPlan.create(
        { userId, isCompleted: false },
        trx,
      );

      for (const day of days) {
        const planDay = await PlanDay.create(
          {
            userId,
            userPlanId: createdPlan.id,
            dayNumber: day.dayNumber,
            label: day.label,
          },
          trx,
        );

        for (const [index, exercise] of day.exercises.entries()) {
          await UserExercise.create(
            {
              userId,
              planDayId: planDay.id,
              exerciseId: exercise.exerciseId,
              sets: exercise.sets,
              reps: exercise.reps,
              rest: exercise.rest,
              order: index + 1,
            },
            trx,
          );
        }
      }

      return createdPlan;
    });

    return { success: true, planId: plan.id, planDays: 7 };
  },
});
