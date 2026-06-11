import { Model } from "objection";
import type {
  ExerciseEquipment,
  ExerciseLevel,
  ExerciseMuscle,
} from "../../constants/exerciseFilters";

export interface ExerciseFilters {
  levels?: ExerciseLevel[];
  equipments?: ExerciseEquipment[];
  muscles?: ExerciseMuscle[];
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
  images?: string[];

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
    levels = [],
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
        if (levels.length) query.whereIn("level", levels);
        if (equipments.length) query.whereIn("equipment", equipments);
        if (muscles.length) {
          query.whereRaw(
            "(jsonb_exists_any(primary_muscles, ?::text[]) or jsonb_exists_any(secondary_muscles, ?::text[]))",
            [muscles, muscles],
          );
        }
      })

      .orderByRaw("random()")
      .limit(limit);
  }

  static async search(filter: Partial<Exercise>): Promise<Exercise[]> {
    const { name, id } = filter;

    let query = name?.trim() || id?.trim();

    if (!query) {
      return [];
    }

    // If name is there then perform fuzzy search with name else use id as query and perform exact fuzzy search over id
    // This is just to find similar exercises
    let queryKey = name ? "name" : "id";

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
        Exercise.raw(`similarity(${queryKey}, ?) as score`, [query]),
      )
      .whereRaw(`similarity(${queryKey}, ?) > ?`, [query, 0.3])
      .orderBy("score", "desc");
  }
}
