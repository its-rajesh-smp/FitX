import express from "express";
import { healthCheck } from "./healthcheck";

export const v1Router = express.Router();

v1Router.get("/health", healthCheck);
