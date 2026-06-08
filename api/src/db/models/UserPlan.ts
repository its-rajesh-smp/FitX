import { Model } from "objection";

export class UserPlan extends Model {
  id!: string;
  userId!: string;
  isCompleted!: boolean;

  static tableName = "user_plans";

  static async create(planData: Partial<Omit<UserPlan, "id">>): Promise<UserPlan> {
    return await this.query().insert(planData);
  }

  static async findById(id: string): Promise<UserPlan | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<UserPlan[]> {
    return await this.query();
  }

  static async update(id: string, planData: Partial<Omit<UserPlan, "id">>): Promise<UserPlan | undefined> {
    return await this.query().patchAndFetchById(id, planData);
  }
}
