import { ChatThread } from "../../../db/models/ChatThread";
import { Message } from "../../../db/models/Message";
import { Request, Response } from "express";

export const getChats = async (req: Request, res: Response) => {
  const userId = req.user?.id!;

  const thread = await ChatThread.findLatestByUserId(userId);

  if (!thread) return res.success({ thread: null, messages: [] });

  const messages = await Message.findByThreadId(thread.id);

  return res.success({ thread, messages });
};
