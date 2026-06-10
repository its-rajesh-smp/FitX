import { Model, Transaction } from "objection";
import { UserExercise } from "./UserExercise";

export class PlanDay extends Model {
  id!: string;
  userId!: string;
  userPlanId!: string;
  name!: string;
  dayNumber!: number;

  userExercises?: UserExercise[];

  static tableName = "plan_days";

  static relationMappings = {
    userExercises: {
      relation: Model.HasManyRelation,
      modelClass: UserExercise,
      join: { from: "plan_days.id", to: "user_exercises.planDayId" },
    },
  };

  static modifiers = {
    orderByDayNumber(builder: any) {
      builder.orderBy("dayNumber");
    },
  };

  static async create(
    dayData: Partial<Omit<PlanDay, "id">>,
    trx?: Transaction,
  ): Promise<PlanDay> {
    return await this.query(trx).insert(dayData);
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

  static async deleteByPlanId(
    planId: string,
    trx?: Transaction,
  ): Promise<number> {
    return await this.query(trx).delete().where("userPlanId", planId);
  }
}
