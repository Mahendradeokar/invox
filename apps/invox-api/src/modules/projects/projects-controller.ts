import { ProjectModel } from "~/models/project-model";
import { createResponse, httpErrors } from "@repo/lib";
import { AsyncHandler } from "~/types";
import { createProjectSchema } from "./projects-validation";
import { z } from "zod";

// Get all projects for the anonymous user
export const getProjects: AsyncHandler = async (req, res) => {
  const anonUserId = res.locals.anonId;

  const projects = await ProjectModel.find({
    anonUser: anonUserId,
  }).sort({ updatedAt: -1 });

  return res.status(200).json(createResponse(projects));
};

export const createProject: AsyncHandler = async (req, res) => {
  const anonUserId = res.locals.anonId;

  const parseResult = createProjectSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw httpErrors.badRequest(z.prettifyError(parseResult.error));
  }

  const { name, selectedTemplate } = parseResult.data;

  const newProject = await ProjectModel.create({
    anonUser: anonUserId,
    name,
    selectedTemplate,
  });

  return res.status(201).json(createResponse(newProject));
};
