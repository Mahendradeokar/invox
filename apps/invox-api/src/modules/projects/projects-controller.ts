import { ProjectModel } from "~/models/project-model";
import { createResponse, httpErrors } from "@repo/lib";
import { AsyncHandler } from "~/types";
import { createProjectSchema } from "./projects-validation";
import { z } from "zod";
import { CreateProjectResponse, GetProjectsResponse } from "@repo/shared-types";
import { ArtifactModel } from "~/models/artifacts-model";
import { createTemplateRepository } from "~/services/templates-service";

const templateRepo = createTemplateRepository("local");

// Get all projects for the anonymous user
export const getProjects: AsyncHandler = async (req, res) => {
  const anonUserId = res.locals.user._id;

  const projects = await ProjectModel.find({
    anonUser: anonUserId,
  })
    .sort({ updatedAt: -1 })
    .lean();

  return res.status(200).json(createResponse<GetProjectsResponse>(projects));
};

export const createProject: AsyncHandler = async (req, res) => {
  const anonUserId = res.locals.user._id;

  const parseResult = createProjectSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw httpErrors.badRequest(z.prettifyError(parseResult.error));
  }

  const { name, selectedTemplate } = parseResult.data;

  const templateDetails = await templateRepo.findTemplate(selectedTemplate);

  if (!templateDetails) {
    throw httpErrors.badRequest("Invalid template provided");
  }

  const newProject = await ProjectModel.create({
    anonUser: anonUserId,
    name,
    selectedTemplate,
  });

  await ArtifactModel.create({
    projectId: newProject._id,
    templateId: selectedTemplate,
    type: "html",
    name: templateDetails.name,
    content: templateDetails.content,
    metadata: {
      createdBy: anonUserId,
    },
  });

  return res
    .status(201)
    .json(createResponse<CreateProjectResponse>(newProject));
};
