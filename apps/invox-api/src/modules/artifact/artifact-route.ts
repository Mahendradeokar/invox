import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import {
  getArtifactById,
  createArtifactShareLink,
  getSharedArtifact,
  downloadArtifact,
} from "./artifact-controller";
import { asyncWrapper } from "~/utils/async-wrapper";

const router: ExpressRouter = Router();

router.get("/:artifactId", asyncWrapper(getArtifactById));
router.post("/share", asyncWrapper(createArtifactShareLink));
router.get("/share/:token", asyncWrapper(getSharedArtifact));
router.get("/download/:artifactId", asyncWrapper(downloadArtifact));

export default router;
