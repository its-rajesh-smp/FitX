import { Model } from "objection";
import type {
  ExerciseEquipment,
  ExerciseLevel,
  ExerciseMuscle,
} from "../../constants/exerciseFilters";

export interface ExerciseFilters {
  level?: ExerciseLevel;
  equipments?: ExerciseEquipment[];
  muscles?: ExerciseMuscle[];
  searchTerms?: string[];
  limit?: number;
}

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

  static async create(
    exerciseData: Partial<Omit<Exercise, "id">>,
  ): Promise<Exercise> {
    return await this.query().insert(exerciseData);
  }

  static async findById(id: string): Promise<Exercise | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<Exercise[]> {
    return await this.query();
  }

  static async update(
    id: string,
    exerciseData: Partial<Omit<Exercise, "id">>,
  ): Promise<Exercise | undefined> {
    return await this.query().patchAndFetchById(id, exerciseData);
  }

  static async findByFilters({
    level,
    equipments = [],
    muscles = [],
    limit = 6,
  }: ExerciseFilters): Promise<Exercise[]> {
    return await this.query()
      .select(
        "id",
        "name",
        "level",
        "equipment",
        "primaryMuscles",
        "secondaryMuscles",
        "instructions",
        "category",
      )
      .modify((query) => {
        if (level) query.where("level", level);
        if (equipments.length) query.whereIn("equipment", equipments);
        if (muscles.length) {
          query.whereRaw(
            "(jsonb_exists_any(primary_muscles, ?::text[]) or jsonb_exists_any(secondary_muscles, ?::text[]))",
            [muscles, muscles],
          );
        }
      })

      .orderByRaw("random()")
      .limit(Math.min(Math.max(limit, 1), 8));
  }
}
