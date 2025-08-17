import { MessageModel } from "~/models/message-model";
import { ProjectModel } from "~/models/project-model";
import {
  createMessageSchema,
  createResponse,
  getProjectMessageSchema,
  httpErrors,
} from "@repo/lib";
import { AIToolLocalState, AsyncHandler } from "~/types";
import { z } from "zod";
import {
  CreateMessageResponse,
  GetProjectMessagesResponse,
} from "@repo/shared-types";
import { ArtifactModel } from "~/models/artifacts-model";
import { generateText, stepCountIs } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import env from "~/env";
import { convertToAISDKMessages } from "~/utils/message";
import { AiSdkTools } from "~/services/ai-sdk-tools";
import { invoxSystemPrompt } from "~/config/prompts";

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

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
  })
    .projection({ meta: 0 })
    .sort({ createdAt: -1 });

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

  const newMessagePayload = {
    anonId: anonUserId,
    projectId: project._id,
    artifactId: artifact._id,
    content,
    role,
  };

  const previousMessages = await MessageModel.find({
    projectId: project._id,
    anonId: anonUserId,
  })
    .sort({ createdAt: 1 })
    .lean();

  const localState: AIToolLocalState = new Map();

  // TODO- use the SSE and handle the same on frontend
  const { text, steps, totalUsage } = await generateText({
    model: openrouter.chat("openai/gpt-4.1-mini"),
    tools: {
      modification_request: AiSdkTools.modification_request(
        artifactId,
        localState
      ),
    },
    stopWhen: stepCountIs(5),
    prepareStep: ({ messages }) => {
      return {
        messages: messages.slice(-12),
      };
    },
    messages: convertToAISDKMessages([...previousMessages, newMessagePayload]),
    maxRetries: 2,
    maxOutputTokens: 1000,
    system: invoxSystemPrompt,
    providerOptions: {
      openrouter: {
        reasoning: {
          max_tokens: 128,
        },
      },
    },
  });

  let latestArtifactId = artifactId;
  let isArtifactUpdated = false;
  const updatedHtml = localState.get("updatedHtml");

  // console.log("IS update", updatedHtml);
  if (updatedHtml) {
    const newArtifact = await ArtifactModel.create({
      name: artifact.name,
      content: updatedHtml,
      metadata: {
        usages: localState.get("toolUsage"),
        createdBy: anonUserId,
      },
      parentId: artifactId,
      nodeType: "child",
      templateId: artifact.templateId,
      projectId: project._id,
    });

    latestArtifactId = newArtifact._id?.toString();
    isArtifactUpdated = true;
  }

  await MessageModel.create(newMessagePayload); // User message

  const assistantMessage = await MessageModel.create({
    anonId: anonUserId,
    artifactId: latestArtifactId,
    content: {
      contentType: "text",
      parts: [text],
    },
    meta: {
      aiSteps: steps.map((step) => {
        return {
          content: step.content,
          warnings: step.warnings,
          finishReason: step.finishReason,
        };
      }),
      usages: totalUsage,
      isArtifactUpdated,
    },
    projectId: projectId,
    role: "assistant",
  });

  return res.status(201).json(
    createResponse<CreateMessageResponse>({
      ...assistantMessage.toJSON(),
      meta: {
        isArtifactUpdated: assistantMessage?.meta?.isArtifactUpdated ?? false,
      },
    })
  );
};
