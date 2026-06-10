import { Request, Response } from "express";
import { UserExercise } from "../../../db/models/UserExercise";
import { UserExerciseLog } from "../../../db/models/UserExerciseLog";

export const toggleUserExercise = async (
  req: Request<{ userExerciseId: string }>,
  res: Response,
) => {
  const { userExerciseId } = req.params;

  const exercise = await UserExercise.findById(userExerciseId);

  if (!exercise) {
    return res.error("Exercise not found", 404);
  }

  const today = new Date().toISOString().split("T")[0];

  const existingLog = await UserExerciseLog.findByExerciseAndDate(
    exercise.id,
    today,
  );

  if (existingLog) {
    await UserExerciseLog.delete(existingLog.id);
    return res.success({ isCompleted: false });
  } else {
    await UserExerciseLog.create({
      userId: req.user!.id,
      userExerciseId: exercise.id,
    });
    return res.success({ isCompleted: true });
  }
};
