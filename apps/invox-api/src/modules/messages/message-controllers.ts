import { MessageModel } from "~/models/message-model";
import { ProjectModel } from "~/models/project-model";
import {
  createMessageSchema,
  createResponse,
  getProjectMessageSchema,
  httpErrors,
  objectIdSchema,
} from "@repo/lib";
import { AsyncHandler } from "~/types";
import { z } from "zod";
import {
  CreateMessageResponse,
  GetProjectMessagesResponse,
} from "@repo/shared-types";
import { ArtifactModel } from "~/models/artifacts-model";

export const getMessagesByProjectId: AsyncHandler = async (req, res) => {
  const { projectId } = req.params;
  const anonUserId = res.locals.user._id;

  const isValidProjectid = getProjectMessageSchema.safeParse(req.params);

  if (!isValidProjectid.success) {
    throw httpErrors.badRequest(z.prettifyError(isValidProjectid.error));
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
    anonUser: anonUserId,
  });

  if (!project) {
    throw httpErrors.notFound("Project not found");
  }

  const messages = await MessageModel.find({
    anonId: anonUserId,
    projectId: projectId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(createResponse<GetProjectMessagesResponse>(messages));
};

export const createMessage: AsyncHandler = async (req, res) => {
  const anonUserId = res.locals.user._id;

  const parseResult = createMessageSchema.safeParse(req.body);

  if (!parseResult.success) {
    throw httpErrors.badRequest(z.prettifyError(parseResult.error));
  }

  const { content, artifactId, role, projectId } = parseResult.data;

  const project = await ProjectModel.findOne({
    anonUser: anonUserId,
    _id: projectId,
  });

  if (!project) {
    throw httpErrors.badRequest("Invalid project for this user");
  }

  const artifact = await ArtifactModel.findOne({ _id: artifactId });

  if (!artifact) {
    throw httpErrors.badRequest("Artifact id is not valid");
  }

  const newMessage = await MessageModel.create({
    anonId: anonUserId,
    projectId: project._id,
    template: {
      id: artifact._id,
      templateContent: artifact.content,
      templateName: artifact.name,
    },
    content,
    role,
  });

  return res
    .status(201)
    .json(createResponse<CreateMessageResponse>(newMessage));
};
