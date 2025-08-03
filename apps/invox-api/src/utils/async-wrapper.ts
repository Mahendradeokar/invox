import { Request, Response, NextFunction } from "express";

type Fn = (r: Request, rs: Response, n: NextFunction) => unknown;

export const asyncWrapper = (fn: Fn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next); // Promise resolve to make sure it alway return a promise in case it provided the sync fn
  };
};
