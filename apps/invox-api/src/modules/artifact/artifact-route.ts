import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import {
  getArtifactById,
  createArtifactShareLink,
  getSharedArtifact,
} from "./artifact-controller";
import { asyncWrapper } from "~/utils/async-wrapper";

const router: ExpressRouter = Router();

router.get("/:artifactId", asyncWrapper(getArtifactById));
router.post("/share", asyncWrapper(createArtifactShareLink));
router.get("/share/:token", asyncWrapper(getSharedArtifact));

export default router;
