import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { getMessagesByProjectId, createMessage } from "./message-controllers";
import { asyncWrapper } from "~/utils/async-wrapper";
import { perAiApiLimiter } from "~/middlewares";

const router: ExpressRouter = Router();

router.get("/:projectId/", asyncWrapper(getMessagesByProjectId));
router.post("/", perAiApiLimiter, asyncWrapper(createMessage));

export default router;
