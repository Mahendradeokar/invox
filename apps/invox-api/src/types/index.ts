import { Request, Response, NextFunction } from "express";

export type AsyncHandler = (
  req: Request,
  res: Response,
  NextFunction?: NextFunction
) => Promise<unknown>;
