import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { asyncWrapper } from "~/utils/async-wrapper";
import { getAllTemplates } from "./template-controller";

const router: ExpressRouter = Router();

router.get("/get-templates", asyncWrapper(getAllTemplates));

export default router;
