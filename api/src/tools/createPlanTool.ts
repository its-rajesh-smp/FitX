import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { db } from "../db";
import { PlanDay } from "../db/models/PlanDay";
import { UserExercise } from "../db/models/UserExercise";
import { UserPlan } from "../db/models/UserPlan";
import type { FitXAgentContext } from "../helpers/chat";

const exerciseInputSchema = z.object({
  exerciseId: z
    .string()
    .describe(
      "The exact exercise id. Get this from the getExercisesTool(). DO not create by your own.",
    ),
  sets: z.number().int().positive().nullable(),
  reps: z.number().int().positive().nullable(),
  rest: z.number().int().positive().nullable(),
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
    .describe("A meaningful label for the plan day."),
  exercises: z
    .array(exerciseInputSchema)
    .max(12)
    .describe("List of exercises need to have in this day."),
});

const planDaysInputSchema = z
  .array(dayInputSchema)
  .length(7)
  .describe("The list of 7 plan days need to have in the workout plan");

export const createPlanTool = tool({
  name: "createWorkoutPlanTool",
  description: `This tool is use to create a new seven-day weekly workout plan for the user.`,
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
