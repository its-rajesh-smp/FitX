import { db } from "../../db";
import { ChatThread, User, UserPlan } from "../../db/models";

export const startNewSession = async (userId: string): Promise<void> => {
  await db.transaction(async (trx) => {
    await ChatThread.deleteByUserId(userId, trx);
    await UserPlan.deleteByUserId(userId, trx);
    await User.update(userId, { details: {} }, trx);
  });
};
