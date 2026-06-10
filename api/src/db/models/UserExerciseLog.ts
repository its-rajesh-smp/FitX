import { Model } from "objection";

export class UserExerciseLog extends Model {
  id!: string;
  userId!: string;
  userExerciseId!: string;

  createdAt!: string;
  updatedAt!: string;

  static tableName = "user_exercise_logs";

  static modifiers = {
    completedToday(builder: any) {
      const today = new Date().toISOString().split("T")[0];
      builder.whereRaw(`DATE("created_at") = ?`, [today]);
    },
  };

  static async findByExerciseAndDate(
    userExerciseId: string,
    date: string,
  ): Promise<UserExerciseLog | undefined> {
    return await this.query()
      .findOne({ userExerciseId })
      .whereRaw(`DATE("created_at") = ?`, [date]);
  }
  static async create(
    data: Partial<Omit<UserExerciseLog, "id">>,
  ): Promise<UserExerciseLog> {
    return await this.query().insert(data);
  }

  static async delete(id: string): Promise<void> {
    await this.query().deleteById(id);
  }
}
