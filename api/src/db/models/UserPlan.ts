import { Model } from "objection";
import { PlanDay } from "./PlanDay";

export class UserPlan extends Model {
  id!: string;
  userId!: string;
  isCompleted!: boolean;

  static tableName = "user_plans";

  // UserPlan
  static relationMappings = {
    days: {
      relation: Model.HasManyRelation,
      modelClass: PlanDay,
      join: { from: "user_plans.id", to: "plan_days.userPlanId" },
    },
  };

  static async create(
    planData: Partial<Omit<UserPlan, "id">>,
  ): Promise<UserPlan> {
    return await this.query().insert(planData);
  }

  static async findById(id: string): Promise<UserPlan | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<UserPlan[]> {
    return await this.query();
  }

  static async update(
    id: string,
    planData: Partial<Omit<UserPlan, "id">>,
  ): Promise<UserPlan | undefined> {
    return await this.query().patchAndFetchById(id, planData);
  }

  static async findByUserIdWithDetails(
    userId: string,
  ): Promise<UserPlan | undefined> {
    return await this.query()
      .findOne({ userId })
      .withGraphFetched("days(orderByOrder).exercises(orderByOrder).exercise");
  }
}
