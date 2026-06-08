import { Model } from "objection";

export class PlanDay extends Model {
  id!: string;
  userId!: string;
  userPlanId!: string;
  name!: string;
  order!: number;
  isCompleted!: boolean;

  static tableName = "plan_days";

  static async create(dayData: Partial<Omit<PlanDay, "id">>): Promise<PlanDay> {
    return await this.query().insert(dayData);
  }

  static async findById(id: string): Promise<PlanDay | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<PlanDay[]> {
    return await this.query();
  }

  static async update(id: string, dayData: Partial<Omit<PlanDay, "id">>): Promise<PlanDay | undefined> {
    return await this.query().patchAndFetchById(id, dayData);
  }
}
