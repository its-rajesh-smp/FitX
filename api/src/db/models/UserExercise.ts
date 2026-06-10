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
}
