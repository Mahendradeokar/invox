import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import {
  getProjects,
  createProject,
  getProjectInitialData,
} from "./projects-controller";
import { asyncWrapper } from "~/utils/async-wrapper";

const router: ExpressRouter = Router();

router.get("/", asyncWrapper(getProjects));

router.post("/create", asyncWrapper(createProject));
router.get("/:projectId/initial-data", asyncWrapper(getProjectInitialData));

export default router;
