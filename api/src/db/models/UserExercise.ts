import { Model, Transaction } from "objection";
import { Exercise } from "./Exercise";
import { UserExerciseLog } from "./UserExerciseLog";

export class UserExercise extends Model {
  id!: string;
  userId!: string;
  planDayId!: string;
  exerciseId!: string;
  reps?: number | null;
  sets?: number | null;
  rest?: number | null;
  order!: number;

  exercise?: Exercise;
  userExerciseLogs?: UserExerciseLog[];

  static tableName = "user_exercises";

  static relationMappings = {
    exercise: {
      relation: Model.BelongsToOneRelation,
      modelClass: Exercise,
      join: { from: "user_exercises.exerciseId", to: "exercises.id" },
    },

    userExerciseLogs: {
      relation: Model.HasManyRelation,
      modelClass: UserExerciseLog,
      join: {
        from: "user_exercises.id",
        to: "user_exercise_logs.userExerciseId",
      },
    },
  };

  static modifiers = {
    orderByOrder(builder: any) {
      builder.orderBy("order");
    },
  };

  static async create(
    exerciseData: Partial<Omit<UserExercise, "id">>,
    trx?: Transaction,
  ): Promise<UserExercise> {
    return await this.query(trx).insert(exerciseData);
  }

  static async findById(id: string): Promise<UserExercise | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<UserExercise[]> {
    return await this.query();
  }

  static async update(
    id: string,
    exerciseData: Partial<Omit<UserExercise, "id">>,
  ): Promise<UserExercise | undefined> {
    return await this.query().patchAndFetchById(id, exerciseData);
  }

  static async removeUserExercise(
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

  static async addUserExercise(
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

  static async adjustUserExerciseVolume(
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

  static async swapUserExercise(
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
}
