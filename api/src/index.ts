import { env } from "./config/env";
import app from "./app";
import { runDBMigrations } from "./db";
import { Agent, run } from "@openai/agents";
import { llmModel } from "./config/llm";

const main = async () => {
  await runDBMigrations();

  // const newAgent = new Agent({
  //   name: "Chat Agent",
  //   model: llmModel,
  // });

  // const res = await run(
  //   newAgent,
  //   "If i want to represent the week days in number format then how they will be? I know there are multiple formats but what do you choose?",
  // );

  // console.log(res.finalOutput);

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

if (!process.env.VERCEL) {
  main().catch((error) => {
    console.error("Error starting the server:", error);
  });
}

export default app;
