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
    // you must delegate to the default Express error handler, when the headers have already been sent to the client:
    return next(err);
  }

  // If the error is an instance of AppError, use its data
  if (err instanceof APIError) {
    res.status(err.status).json(err.toResponse());
    return;
  }

  // For unhandled/unexpected errors, respond with a generic internal server error
  console.error("Unexpected Error:", err);

  res.status(500).json({
    code: "internal_server_error",
    detail: "An unexpected error occurred.",
    meta: {},
  });
}
