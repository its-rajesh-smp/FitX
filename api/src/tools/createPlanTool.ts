import type { FitXAgentContext } from "@helpers/chat";
import { PlanDay } from "@models/PlanDay";
import { UserExercise } from "@models/UserExercise";
import { UserPlan } from "@models/UserPlan";
import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

const exerciseInputSchema = z.object({
  exerciseId: z.string(),
  sets: z.number().int().positive().nullable(),
  reps: z.number().int().positive().nullable(),
  rest: z.number().int().positive().nullable(), // seconds
});

const dayInputSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .refine((name) => !/^day\s*\d+(?:\s*-\s*day\s*\d+)?$/i.test(name.trim()), {
      message: "Use a meaningful workout name, not a generic day label.",
    }),
  scheduledAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  exercises: z.array(exerciseInputSchema).min(1).max(8),
});

export const createPlanTool = tool({
  name: "createPlan",
  description:
    "Create a full workout plan with meaningful workout names, scheduled dates, and ordered exercises.",
  parameters: z.object({
    days: z
      .array(dayInputSchema)
      .min(1)
      .max(7)
      .refine(
        (days) =>
          new Set(days.map(({ scheduledAt }) => scheduledAt)).size ===
          days.length,
        { message: "Each workout day must have a unique scheduled date." },
      ),
  }),
  execute: async ({ days }, runContext?: RunContext<FitXAgentContext>) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");
    const { userId, emit } = runContext.context;

    emit({
      type: "status",
      status: "generating_plan",
      label: "Creating your workout plan",
    });

    const existing = await UserPlan.findByUserIdWithDetails(userId);

    if (existing) {
      await PlanDay.deleteByPlanId(existing.id);
      await UserPlan.query().deleteById(existing.id);
    }

    const plan = await UserPlan.create({ userId, isCompleted: false });

    for (const day of days) {
      const planDay = await PlanDay.create({
        userId,
        userPlanId: plan.id,
        name: day.name,
        scheduledAt: new Date(day.scheduledAt),
      });

      for (const [index, exercise] of day.exercises.entries()) {
        await UserExercise.create({
          userId,
          planDayId: planDay.id,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: exercise.rest,
          isCompleted: false,
          order: index + 1,
        });
      }
    }

    return { success: true, planId: plan.id };
  },
});
