import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { getProjects, createProject } from "./projects-controller";
import { asyncWrapper } from "~/utils/async-wrapper";

const router: ExpressRouter = Router();

router.get("/", asyncWrapper(getProjects));

router.post("/", asyncWrapper(createProject));

export default router;
