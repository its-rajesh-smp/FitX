import { env } from "@config/env";
import "tsconfig-paths/register"; // Enables path aliases
import { createExpressApp } from "./app";

const main = async () => {
  const app = createExpressApp();

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

main().catch((error) => {
  console.error("Error starting the server:", error);
});
