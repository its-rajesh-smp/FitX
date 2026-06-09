import { env } from "./config/env";
import app from "./app";
import { runDBMigrations } from "./db";

const main = async () => {
  await runDBMigrations();

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
