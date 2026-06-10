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

  const patch = result.finalOutput;

  if (!patch || Object.keys(patch).length === 0) {
    return user;
  }

  const details = {
    ...(user.details ?? {}),
    ...patch,
  };

  return (await User.update(user.id, { details })) ?? user;
};
