import { memoryLlmModel } from "../../config/llm";
import { User } from "../../db/models/User";
import { Agent, run } from "@openai/agents";
import { z } from "zod";

const userDetailsUpdateSchema = z.object({
  upserts: z.array(
    z.object({
      key: z.string().min(1).max(60),
      value: z.string().min(1).max(500),
    }),
  ),
  removals: z.array(z.string().min(1).max(60)),
});

const userDetailsAgent = new Agent({
  name: "FitX User Details",
  model: memoryLlmModel,
  outputType: userDetailsUpdateSchema,
  instructions: `Maintain the user's long-term details for a personal fitness assistant.

Store only information that is very important for future conversations:
- Exercise and health-relevant facts such as goals, experience, injuries, limitations, equipment, schedule, preferences, measurements, and habits.
- Important facts about the user, their personality, or themselves when the user explicitly states them.

Rules:
- Extract only from the latest user message. Never infer facts or store assistant suggestions.
- Do not store greetings, temporary moods, one-off questions, notes, guides or unimportant conversation.
- Use stable camelCase keys and concise factual string values.
- For onboarding facts, always use these canonical keys: height, weight, gender, experienceLevel, workoutLocation.
- Store units with height and weight when the user provides them.
- Map beginner/new/no experience to experienceLevel="Beginner", and experienced/intermediate/advanced to experienceLevel="Experienced".
- Map gym access to workoutLocation="Gym access" and home/bodyweight/no gym to workoutLocation="Home workouts".
- Upsert corrected facts using the same key.
- Remove a key only when the user explicitly says that fact no longer applies.
- Return empty arrays when no details should change.
`,
});

export const updateUserDetails = async ({
  user,
  message,
}: {
  user: User;
  message: string;
}): Promise<User> => {
  const result = await run(
    userDetailsAgent,
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
  for (const update of upserts) details[update.key] = update.value;

  return (await User.update(user.id, { details })) ?? user;
};
