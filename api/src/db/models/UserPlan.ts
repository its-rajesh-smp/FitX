import { Model, Transaction } from "objection";
import { PlanDay } from "./PlanDay";

export class UserPlan extends Model {
  id!: string;
  userId!: string;
  isCompleted!: boolean;

  planDays?: PlanDay[];

  static tableName = "user_plans";

  // UserPlan
  static relationMappings = {
    planDays: {
      relation: Model.HasManyRelation,
      modelClass: PlanDay,
      join: { from: "user_plans.id", to: "plan_days.userPlanId" },
    },
  };

  static async create(
    planData: Partial<Omit<UserPlan, "id">>,
    trx?: Transaction,
  ): Promise<UserPlan> {
    return await this.query(trx).insert(planData);
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

  static async deleteByUserId(
    userId: string,
    trx?: Transaction,
  ): Promise<number> {
    return await this.query(trx).delete().where({ userId });
  }

  static async findByUserIdWithDetails(
    userId: string,
  ): Promise<UserPlan | undefined> {
    const plan = await this.query()
      .findOne({ userId })
      .withGraphFetched(
        "planDays(orderByDayNumber).userExercises(orderByOrder).[exercise, userExerciseLogs(completedToday)]",
      );

    if (!plan) return undefined;

    // Derive isCompleted and clean up the response
    plan.planDays?.forEach((day) => {
      day.userExercises?.forEach((exercise) => {
        (exercise as any).isCompleted = exercise.userExerciseLogs!.length > 0;
        delete (exercise as any).userExerciseLogs;
        delete (exercise as any).instructions;
        delete (exercise as any).images;
        delete (exercise as any).createdAt;
        delete (exercise as any).updatedAt;
      });
    });

    return plan;
  }
}
