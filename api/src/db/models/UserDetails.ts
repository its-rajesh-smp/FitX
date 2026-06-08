import { Model } from "objection";

export class UserDetails extends Model {
  userId!: string;
  gender?: string | null;
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  workoutEnvironment?: string | null;
  workoutGoal?: string | null;
  userMemory!: Record<string, unknown>;

  static tableName = "user_details";
  static idColumn = "userId";

  static async create(detailsData: Partial<UserDetails>): Promise<UserDetails> {
    return await this.query().insert(detailsData);
  }

  static async findById(userId: string): Promise<UserDetails | undefined> {
    return await this.query().findById(userId);
  }

  static async findAll(): Promise<UserDetails[]> {
    return await this.query();
  }

  static async update(userId: string, detailsData: Partial<UserDetails>): Promise<UserDetails | undefined> {
    return await this.query().patchAndFetchById(userId, detailsData);
  }
}
