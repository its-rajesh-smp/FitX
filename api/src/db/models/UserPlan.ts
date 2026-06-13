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
    excludeFieldsForLlm: boolean = true,
  ): Promise<UserPlan | undefined> {
    const plan = await this.query()
      .findOne({ userId })
      .withGraphFetched(
        "planDays(orderByDayNumber).userExercises(orderByOrder).[exercise, userExerciseLogs(completedToday)]",
      );

    if (!plan) return undefined;

    // Derive isCompleted and clean up the response
    plan.planDays?.forEach((day) => {
      day.userExercises?.forEach((userExercise) => {
        (userExercise as any).isCompleted =
          (userExercise as any).userExerciseLogs?.length > 0;

        delete (userExercise as any).userExerciseLogs;

        // LLM don't need these fields
        if (excludeFieldsForLlm) {
          delete (userExercise as any).exercise?.instructions;
          delete (userExercise as any).exercise?.images;
          delete (userExercise as any).exercise?.createdAt;
          delete (userExercise as any).exercise?.updatedAt;
        }
      });

      // LLM don't need these fields
      if (excludeFieldsForLlm) {
        delete (day as any).createdAt;
        delete (day as any).updatedAt;
      }
    });

    return plan;
  }
}
