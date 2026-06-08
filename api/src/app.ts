import express from "express";
import { setupMiddleware } from "./middlewares";
import { setupRoutes } from "./routes";

export const createExpressApp = () => {
  const app = express();

  setupMiddleware(app);
  setupRoutes(app);

  return app;
};
