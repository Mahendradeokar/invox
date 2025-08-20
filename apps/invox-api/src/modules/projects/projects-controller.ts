import { ProjectModel } from "~/models/project-model";
import {
  createProjectSchema,
  createResponse,
  getProjectsQuerySchema,
  httpErrors,
  objectIdSchema,
  tryCatch,
} from "@repo/lib";
import { AsyncHandler } from "~/types";
import { z } from "zod";
import {
  CreateProjectResponse,
  GetInitialProjectData,
  GetProjectsResponse,
} from "@repo/shared-types";
import { ArtifactModel } from "~/models/artifacts-model";
import { createTemplateRepository } from "~/services/templates-service";
import { MessageModel } from "~/models/message-model";
import {
  getAIsTemplateSelectionMessage,
  getTemplateSelectionMessage,
} from "~/utils/message";

const templateRepo = createTemplateRepository("local");

const LIMIT = 10;

// export const getLatestArtifactByAnonAndProject = async ({
//   anonUserId,
//   projectId,
// }: {
//   anonUserId: string;
//   projectId: string;
// }) => {
//   return ArtifactModel.findOne({
//     projectId,
//     "metadata.createdBy": anonUserId,
//     isDeleted: false,
//   })
//     .sort({ version: -1 })
//     .lean();
// };

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

  // const projectsWithArtifacts = await Promise.all(
  //   projects.map(async (project) => {
  //     const { data, error } = await tryCatch(
  //       getLatestArtifactByAnonAndProject({
  //         anonUserId: anonUserId,
  //         projectId: project._id.toString(),
  //       })
  //     );

  //     if (error || !data) {
  //       return {
  //         ...project,
  //         artifact: null,
  //       };
  //     }

  //     return {
  //       ...project,
  //       artifact: {
  //         ...data,
  //       },
  //     };
  //   })
  // );

  return res.status(200).json(
    createResponse<GetProjectsResponse>({
      projects: projects,
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
    templatedMeta: templateDetails,
  });

  const artifactCreated = await ArtifactModel.create({
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

  await MessageModel.create({
    anonId: anonUserId,
    content: {
      contentType: "text",
      parts: [getTemplateSelectionMessage(templateDetails.name)],
    },
    projectId: newProject._id,
    role: "user",
    artifactId: artifactCreated._id,
  });

  await MessageModel.create({
    anonId: anonUserId,
    content: {
      contentType: "text",
      parts: [getAIsTemplateSelectionMessage(templateDetails.name)],
    },
    projectId: newProject._id,
    role: "assistant",
    artifactId: artifactCreated._id,
    meta: {
      isArtifactUpdated: true,
    },
  });

  return res
    .status(201)
    .json(createResponse<CreateProjectResponse>(newProject));
};

export const getProjectInitialData: AsyncHandler = async (req, res) => {
  const anonUserId = res.locals.user._id;
  const parseResult = objectIdSchema.safeParse(req.params.projectId);

  if (!parseResult.success) {
    throw httpErrors.badRequest(z.prettifyError(parseResult.error));
  }

  const projectId = parseResult.data;

  // Only fetch project belonging to this anon user
  const project = await ProjectModel.findOne({
    _id: projectId,
    anonUser: anonUserId,
  });

  if (!project) {
    throw httpErrors.notFound("Project not found");
  }

  const messages = await MessageModel.find({ projectId, anonId: anonUserId })
    .sort({ createdAt: 1 })
    .lean();

  let latestArtifact = null;

  if (messages[0]?.artifactId) {
    latestArtifact = await ArtifactModel.findOne({
      _id: messages[0].artifactId,
      "metadata.createdBy": anonUserId,
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  return res.json(
    createResponse<GetInitialProjectData>({
      id: projectId,
      project: project,
      messages: messages || [],
      latestArtifact: latestArtifact || null,
    })
  );
};
