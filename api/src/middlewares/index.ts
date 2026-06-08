import express, { Express } from "express";

import cors from "cors";
import { responseFormatter } from "./responseFormatter";

export const setupMiddleware = (app: Express) => {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(responseFormatter);
};
