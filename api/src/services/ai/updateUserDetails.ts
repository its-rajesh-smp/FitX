import { run } from "@openai/agents";
import { userLongTermMemoryAgent } from "../../agents";
import { User } from "../../db/models/User";

export const updateUserDetails = async ({
  user,
  message,
}: {
  user: User;
  message: string;
}): Promise<User> => {
  const result = await run(
    userLongTermMemoryAgent,
    `Existing user details:
${JSON.stringify(user.details ?? {})}

Latest user message:
${message}`,
    { maxTurns: 1 },
  );

  if (!result.finalOutput) {
    throw new Error("USER_DETAILS_EXTRACTION_EMPTY");
  }

  const { upserts, removals } = result.finalOutput;

  if (upserts.length === 0 && removals.length === 0) return user;

  const details = { ...(user.details ?? {}) };

  for (const key of removals) delete details[key];

  for (const update of upserts) {
    Object.assign(details, {
      [update.key]: update.value,
    });
  }

  return (await User.update(user.id, { details })) ?? user;
};
