import { NextFunction, Request, Response } from "express";
import z, { ZodError, ZodObject } from "zod";

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.parseAsync(req.body);
      req.body = data;
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const prettyError = z.flattenError(error);
        return res.error("Invalid request", 400, prettyError, {
          sendError: true,
        });
      }

      return res.error("Internal server error", 500, null, {
        sendError: true,
      });
    }
  };
};
