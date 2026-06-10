import type { FitXAgentContext } from "../helpers/chat";
import { PlanDay } from "../db/models/PlanDay";
import { UserExercise } from "../db/models/UserExercise";
import { UserPlan } from "../db/models/UserPlan";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";
import { db } from "../db";

const exerciseInputSchema = z.object({
  exerciseId: z.string(),
  sets: z.number().int().positive().nullable(),
  reps: z.number().int().positive().nullable(),
  rest: z.number().int().positive().nullable(), // seconds
});

const dayInputSchema = z.object({
  dayNumber: z.number().int().min(0).max(6),
  name: z
    .string()
    .min(1)
    .max(100)
    .refine((name) => !/^day\s*\d+(?:\s*-\s*day\s*\d+)?$/i.test(name.trim()), {
      message: "Use a meaningful workout name, not a generic day label.",
    }),
  exercises: z.array(exerciseInputSchema).max(8),
});

const planDaysInputSchema = z
  .array(dayInputSchema)
  .length(7)
  .refine(
    (days) =>
      new Set(days.map(({ dayNumber }) => dayNumber)).size === 7,
    {
      message:
        "A weekly plan must contain every dayNumber exactly once from 0 (Sunday) to 6 (Saturday).",
    },
  );

export const createPlanTool = tool({
  name: "createPlan",
  description:
    "Create a complete seven-day weekly workout plan. Provide every dayNumber exactly once: 0 is Sunday through 6 is Saturday. The current dayNumber provided in the prompt must contain exercises so the plan starts today. Other rest days must have an empty exercises array.",
  parameters: z.object({
    days: planDaysInputSchema,
  }),
  execute: async ({ days }, runContext?: RunContext<FitXAgentContext>) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");
    const { userId, currentDayNumber, emit } = runContext.context;

    const today = days.find((day) => day.dayNumber === currentDayNumber);
    if (!today?.exercises.length) {
      return {
        error:
          "A newly created weekly plan must start with a workout today. Add exercises to the current dayNumber from the prompt.",
      };
    }

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
            name: day.name,
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
              isCompleted: false,
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
