import { Router } from "express";
import { searchVideos } from "./searchVideos";

export const videosRouter = Router();

videosRouter.get("/search", searchVideos);
