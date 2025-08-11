import { ProjectModel } from "~/models/project-model";
import {
  createProjectSchema,
  createResponse,
  getProjectsQuerySchema,
  httpErrors,
} from "@repo/lib";
import { AsyncHandler } from "~/types";
import { z } from "zod";
import { CreateProjectResponse, GetProjectsResponse } from "@repo/shared-types";
import { ArtifactModel } from "~/models/artifacts-model";
import { createTemplateRepository } from "~/services/templates-service";

const templateRepo = createTemplateRepository("local");

const LIMIT = 10;

export const getProjects: AsyncHandler = async (req, res) => {
  const anonUserId = res.locals.user._id;
  const parseResult = getProjectsQuerySchema.safeParse(req.query);

  if (!parseResult.success) {
    throw httpErrors.badRequest(z.prettifyError(parseResult.error));
  }

  const { page = 1, limit = LIMIT } = parseResult.data;
  const skip = (page - 1) * limit;
  const total = await ProjectModel.countDocuments({
    anonUser: anonUserId,
  });

  const projects = await ProjectModel.find({
    anonUser: anonUserId,
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return res.status(200).json(
    createResponse<GetProjectsResponse>({
      projects,
      meta: {
        page,
        limit,
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
      },
    })
  );
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

  const cf = await ArtifactModel.create({
    projectId: newProject._id,
    templateId: selectedTemplate,
    type: "html",
    name: templateDetails.name,
    nodeType: "parent",
    content: templateDetails.content,
    metadata: {
      createdBy: anonUserId,
    },
  });

  console.log("CF", cf);
  return res
    .status(201)
    .json(createResponse<CreateProjectResponse>(newProject));
};
