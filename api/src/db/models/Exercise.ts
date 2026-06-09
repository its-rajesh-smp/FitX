import { Model } from "objection";

export interface ExerciseFilters {
  level?: "beginner" | "intermediate" | "expert";
  equipments?: string[];
  muscles?: string[];
  searchTerms?: string[];
  limit?: number;
}

export interface ExerciseFilterOptions {
  levels: string[];
  equipments: string[];
  muscles: string[];
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

  static async getFilterOptions(): Promise<ExerciseFilterOptions> {
    const [levels, equipments, muscles] = await Promise.all([
      this.query().distinct("level").whereNotNull("level").orderBy("level"),
      this.query()
        .distinct("equipment")
        .whereNotNull("equipment")
        .orderBy("equipment"),
      this.knex().raw<{ rows: Array<{ muscle: string }> }>(`
        select distinct muscle
        from exercises,
        lateral jsonb_array_elements_text(primary_muscles || secondary_muscles) muscle
        order by muscle
      `),
    ]);

    return {
      levels: levels.map(({ level }) => level).filter(Boolean) as string[],
      equipments: equipments
        .map(({ equipment }) => equipment)
        .filter(Boolean) as string[],
      muscles: muscles.rows.map(({ muscle }) => muscle),
    };
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
