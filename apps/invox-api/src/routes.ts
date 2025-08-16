import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import { templateRoutes } from "./modules/invox-templates";
import { projectRouter } from "./modules/projects";
import { messageRoute } from "./modules/messages";
import { artifactRoute } from "./modules/artifact";

const router: ExpressRouter = Router();
const v1Router: ExpressRouter = Router();

v1Router.use("/templates", templateRoutes);
v1Router.use("/projects", projectRouter);
v1Router.use("/messages", messageRoute);
v1Router.use("/artifacts", artifactRoute);

router.use("/v1", v1Router);

export default router;
