import { UserExercise } from "../../../db/models/UserExercise";
import { Request, Response } from "express";

export const toggleUserExercise = async (
  req: Request<{ userExerciseId: string }>,
  res: Response,
) => {
  const exercise = await UserExercise.findById(req.params.userExerciseId);

  if (!exercise || exercise.userId !== req.user!.id) {
    return res.error("Exercise not found", 404, null, { sendError: true });
  }

  const updated = await UserExercise.update(exercise.id, {
    isCompleted: !exercise.isCompleted,
  });

  return res.success(updated);
};
