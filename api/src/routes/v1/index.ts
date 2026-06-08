import express from "express";
import { verifyUser } from "../../middlewares/auth";
import { authRouter } from "./auth";
import { chatsRouter } from "./chats";
import { healthCheck } from "./healthcheck";
import { meRouter } from "./me";

export const v1Router = express.Router();

v1Router.get("/health", healthCheck);
v1Router.use("/auth", authRouter);
v1Router.use("/me", verifyUser, meRouter);
v1Router.use("/chats", verifyUser, chatsRouter);
