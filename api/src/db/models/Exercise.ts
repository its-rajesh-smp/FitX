import { Model } from "objection";

export class Exercise extends Model {
  id!: string;
  name!: string;
  force?: string | null;
  level?: string | null;
  mechanic?: string | null;
  equipment?: string | null;
  primaryMuscles!: string[];
  secondaryMuscles!: string[];
  instructions!: string[];
  category?: string | null;

  static tableName = "exercises";

  static async create(exerciseData: Partial<Omit<Exercise, "id">>): Promise<Exercise> {
    return await this.query().insert(exerciseData);
  }

  static async findById(id: string): Promise<Exercise | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<Exercise[]> {
    return await this.query();
  }

  static async update(id: string, exerciseData: Partial<Omit<Exercise, "id">>): Promise<Exercise | undefined> {
    return await this.query().patchAndFetchById(id, exerciseData);
  }
}
