import axios from "axios";
import { Request, Response } from "express";
import { env } from "../../../config/env";

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId?: string };
    snippet: {
      channelTitle: string;
      thumbnails: { medium?: { url: string } };
      title: string;
    };
  }>;
}

export const searchVideos = async (req: Request, res: Response) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!query) return res.error("Search query is required", 400);
  if (!env.YOUTUBE_API_KEY) {
    return res.error("YouTube video search is not configured", 503);
  }

  try {
    const response = await axios.get<YouTubeSearchResponse>(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          key: env.YOUTUBE_API_KEY,
          maxResults: 2,
          safeSearch: "moderate",
          type: "video",
          videoEmbeddable: "true",
        },
      },
    );

    return res.success(
      response.data.items.flatMap((item) =>
        item.id.videoId
          ? [
              {
                id: item.id.videoId,
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle,
                thumbnailUrl: item.snippet.thumbnails.medium?.url ?? null,
              },
            ]
          : [],
      ),
    );
  } catch (error) {
    return res.error("Unable to load YouTube exercise guides", 502, error, {
      sendError: false,
    });
  }
};
