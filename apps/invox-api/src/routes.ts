import { Router } from "express";
import type { Router as ExpressRouter } from "express";

import { templateRoutes } from "./modules/invox-templates";
import { projectRouter } from "./modules/projects";

const router: ExpressRouter = Router();
const v1Router: ExpressRouter = Router();

v1Router.use("/t", templateRoutes);
v1Router.use("/p", projectRouter);

router.use("/v1", v1Router);

export default router;
