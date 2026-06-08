import { Model } from "objection";

export class UserExercise extends Model {
  id!: string;
  userId!: string;
  planDayId!: string;
  exerciseId!: string;
  reps?: number | null;
  sets?: number | null;
  rest?: number | null;
  isCompleted!: boolean;

  static tableName = "user_exercises";

  static async create(exerciseData: Partial<Omit<UserExercise, "id">>): Promise<UserExercise> {
    return await this.query().insert(exerciseData);
  }

  static async findById(id: string): Promise<UserExercise | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<UserExercise[]> {
    return await this.query();
  }

  static async update(id: string, exerciseData: Partial<Omit<UserExercise, "id">>): Promise<UserExercise | undefined> {
    return await this.query().patchAndFetchById(id, exerciseData);
  }
}
