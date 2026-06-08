import { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  interface Response {
    success: (data: any, message?: string) => void;

    error: (
      message: string,
      statusCode?: number,
      error?: any,
      { sendError }?: { sendError?: boolean },
    ) => void;
  }
}

export const responseFormatter = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.success = (data: any, message: string = "Success") => {
    res.status(200).json({
      success: true,
      message,
      data,
    });
  };

  res.error = (
    message: string,
    statusCode = 500,
    error?: any,
    { sendError = true }: { sendError?: boolean } = {},
  ) => {
    res.status(statusCode).json({
      success: false,
      message,
      ...(sendError ? { error } : {}),
    });
  };

  next();
};
