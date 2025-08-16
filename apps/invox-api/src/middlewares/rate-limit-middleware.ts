import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import env from "~/env";
import { httpErrors } from "@repo/lib";

export const perIpLimiter = rateLimit({
  windowMs: Number(env.IP_RATE_LIMIT_WINDOW_IN_MS),
  max: Number(env.IP_RATE_LIMIT_REQ),
  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip || "unknown-ip");
  },
  standardHeaders: true,
  handler: (req, res, next) => {
    next(
      httpErrors.tooManyRequests(
        "Too many requests from this IP, please try again later."
      )
    );
  },
});

export const perUserLimiter = rateLimit({
  windowMs: Number(env.USER_RATE_LIMIT_WINDOW_IN_MS),
  max: Number(env.USER_RATE_LIMIT_REQ),
  keyGenerator: (req) => {
    const anonId = req.header("x-anon-id");
    return `${req.ip}-${anonId}`;
  },
  validate: {
    keyGeneratorIpFallback: false,
  },
  standardHeaders: true,
  handler: (req, res, next) => {
    next(
      httpErrors.tooManyRequests(
        "Too many requests for this user, please try again later."
      )
    );
  },
});

export const perAiApiLimiter = rateLimit({
  windowMs: Number(env.AI_API_RATE_LIMIT_WINDOW_IN_MS),
  max: Number(env.AI_API_RATE_LIMIT_REQ),
  keyGenerator: (req) => {
    const anonId = req.header("x-anon-id");
    return `ai-${req.ip}-${anonId}`;
  },
  validate: {
    keyGeneratorIpFallback: false,
  },
  standardHeaders: true,
  handler: (req, res, next) => {
    next(
      httpErrors.tooManyRequests(
        "Too many AI API requests, please try again later."
      )
    );
  },
});
