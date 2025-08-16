import { APIError } from "@repo/lib";
import type { APIErrorClass } from "@repo/lib";
import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: APIErrorClass | Error | unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }

  // If the error is an instance of AppError, use its data
  if (err instanceof APIError) {
    res.status(err.status).json(err.toResponse());
    return;
  }

  if (err instanceof Error) {
    console.error("Unexpected Error:", err.message);
    console.error("Unexpected Error:", err);
  } else {
    console.error("Unexpected Error:", err);
  }

  res.status(500).json({
    code: "internal_server_error",
    detail: "An unexpected error occurred.",
    meta: {},
  });
}
