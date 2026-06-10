import { memoryLlmModel } from "../../config/llm";
import {
  EXERCISE_EQUIPMENT,
  EXERCISE_LEVELS,
  EXERCISE_MUSCLES,
} from "../../constants/exerciseFilters";
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

Store only the three exercise setup filters: experience level, target muscles, and available equipment.

Rules:
- Extract only from the latest user message. Never infer facts or store assistant suggestions.
- Do not store any other facts.
- Use stable camelCase keys and concise factual string values.
- For exercise setup, always use these canonical keys: experienceLevel, targetMuscles, availableEquipment.
- Map "Never really worked out before" to experienceLevel="beginner".
- Map "Worked out before, but not consistently (less than 6 months)" to experienceLevel="intermediate".
- Map "I work out regularly (6+ months)" to experienceLevel="expert".
- Valid experience levels: ${EXERCISE_LEVELS.join(", ")}.
- Valid target muscles: ${EXERCISE_MUSCLES.join(", ")}.
- A Full Body, Upper Body, or Lower Body prefix describes the targetMuscles that follow it; store only the valid comma-separated muscles, without the prefix.
- Valid equipment: ${EXERCISE_EQUIPMENT.join(", ")}.
- Store targetMuscles and availableEquipment as concise comma-separated valid catalog values.
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
