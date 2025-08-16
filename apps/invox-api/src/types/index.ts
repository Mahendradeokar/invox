import { LanguageModelUsage } from "ai";
import { Request, Response, NextFunction } from "express";

export type AsyncHandler = (
  req: Request,
  res: Response,
  NextFunction?: NextFunction
) => Promise<unknown>;

export type AIToolLocalState = Map<
  "updatedHtml" | "toolUsage",
  string | LanguageModelUsage
>;
