import { RunContext, tool } from "@openai/agents";
import z from "zod";
import { Exercise } from "../db/models";
import { FitXAgentContext } from "../helpers/chat";

export const getExerciseDetailTool = tool({
  name: "getExerciseDetail",
  description: `Get details for one specific exercise from the exercise database.

Use this tool when you need to get exercise details for a specific exercise.

Tool Behavior:
- This tool is designed in such a way that. It uses id or name to find the exercise.
- If the exercises is found by id then it returns that.
- If the exercises is not found by the id then it performs a fuzzy search over the name and returns the best matches.
- If name is not provided and only the id is provided then it performs a fuzzy search over the id and returns the best matches.

Important:
- Call this only for a specific exercise lookup or explanation.
- Do not call this for every exercise in a generated workout plan.
- If multiple exercises are returned, use the best match unless the result is ambiguous.
- If no exercise is found, say that the exercise is not available in the dataset.
- User might infer the exercise name from the plan, use getPlanTool to get the exercises and then try to find the id.
`,
  parameters: z.object({
    exerciseId: z.string().optional(),
    name: z.string().optional(),
  }),
  execute: async (
    { exerciseId, name },
    runContext?: RunContext<FitXAgentContext>,
  ) => {
    if (!runContext) throw new Error("FITX_AGENT_CONTEXT_REQUIRED");

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Finding exercise details",
    });

    if (exerciseId) {
      const exercise = await Exercise.findById(exerciseId);

      if (exercise) {
        runContext.context.emit({
          type: "status",
          status: "getting_exercises",
          label: "Found exercise details",
        });
        return { success: true, exercise };
      }
    }

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: "Finding matching exercises",
    });

    const exercises = await Exercise.search({ name, id: exerciseId });

    if (!exercises.length) return { error: "Any matching exercises not found" };

    runContext.context.emit({
      type: "status",
      status: "getting_exercises",
      label: `Found ${exercises.length} matching exercises`,
    });

    return {
      success: true,
      matches: exercises,
    };
  },
});
