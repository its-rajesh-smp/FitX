import { run } from "@openai/agents";
import { userLongTermMemoryAgent } from "../../agents";
import { User, UserDetails } from "../../db/models/User";

const normalizedUserDetails = (details: any) => {
  const normalizedDetails: UserDetails = {};

  if (details.experienceLevel) {
    normalizedDetails.experienceLevel = details.experienceLevel;
  }

  if (details.targetMuscles) {
    normalizedDetails.targetMuscles = details.targetMuscles;
  }

  if (details.availableEquipment) {
    normalizedDetails.availableEquipment = details.availableEquipment;
  }

  return normalizedDetails;
};

const getPrompt = (details: UserDetails, message: string) => {
  return `
Here is the current user's details stored as memory:
${JSON.stringify(details)}

Here is the latest user's message:
${message}
`;
};

export const updateUserDetails = async ({
  user,
  message,
}: {
  user: User;
  message: string;
}): Promise<User> => {
  const prompt = getPrompt(user.details ?? {}, message);

  const result = await run(userLongTermMemoryAgent, prompt, { maxTurns: 1 });

  const patch = result.finalOutput;

  if (!patch || Object.keys(patch).length === 0) {
    return user;
  }

  const details = {
    ...(user.details ?? {}),
    ...patch,
  };

  const normalizedDetails = normalizedUserDetails(details);

  return (await User.update(user.id, { details: normalizedDetails })) ?? user;
};
