import { validate } from "../../../middlewares/zod";
import { sendChatMessageSchema } from "../../../validators/chat/sendChatMessage";
import { Router } from "express";
import { getChats } from "./getChats";
import { sendChatMessage } from "./sendChatMessage";

export const chatsRouter = Router();

chatsRouter.get("/", getChats);
chatsRouter.post("/", validate(sendChatMessageSchema), sendChatMessage);
