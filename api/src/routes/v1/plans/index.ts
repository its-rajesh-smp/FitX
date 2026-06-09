import { Router } from "express";
import { getCurrentPlan } from "./getCurrentPlan";
import { toggleUserExercise } from "./toggleUserExercise";

export const plansRouter = Router();

plansRouter.get("/me", getCurrentPlan);
plansRouter.patch("/exercises/:userExerciseId/toggle", toggleUserExercise);
