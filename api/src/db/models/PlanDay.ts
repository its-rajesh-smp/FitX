import { Model } from "objection";
import { UserExercise } from "./UserExercise";

export class PlanDay extends Model {
  id!: string;
  userId!: string;
  userPlanId!: string;
  name!: string;
  scheduledAt!: Date;

  static tableName = "plan_days";

  static relationMappings = {
    exercises: {
      relation: Model.HasManyRelation,
      modelClass: UserExercise,
      join: { from: "plan_days.id", to: "user_exercises.planDayId" },
    },
  };

  static modifiers = {
    orderByScheduledAt(builder: any) {
      builder.orderBy("scheduledAt");
    },
  };

  static async create(dayData: Partial<Omit<PlanDay, "id">>): Promise<PlanDay> {
    return await this.query().insert(dayData);
  }

  static async findById(id: string): Promise<PlanDay | undefined> {
    return await this.query().findById(id);
  }

  static async findAll(): Promise<PlanDay[]> {
    return await this.query();
  }

  static async update(
    id: string,
    dayData: Partial<Omit<PlanDay, "id">>,
  ): Promise<PlanDay | undefined> {
    return await this.query().patchAndFetchById(id, dayData);
  }

  static async deleteByPlanId(planId: string): Promise<number> {
    return await this.query().delete().where("userPlanId", planId);
  }
}
