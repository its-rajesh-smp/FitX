import { env } from "@config/env";
import "tsconfig-paths/register"; // Enables path aliases
import { createExpressApp } from "./app";
import { runDBMigrations } from "./db";

const main = async () => {
  const app = createExpressApp();

  await runDBMigrations();

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

main().catch((error) => {
  console.error("Error starting the server:", error);
});
