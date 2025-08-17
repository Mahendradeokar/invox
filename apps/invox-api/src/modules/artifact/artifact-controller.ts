import { ArtifactModel } from "~/models/artifacts-model";
import { createResponse, httpErrors, objectIdSchema } from "@repo/lib";
import { AsyncHandler } from "~/types";
import { z } from "zod";
import {
  CreateArtifactShareLinkResponse,
  GetArtifactResponse,
  GetSharedArtifactResponse,
} from "@repo/shared-types";
import { ArtifactService } from "~/services/artifact-service";
import crypto from "crypto";

export const getArtifactById: AsyncHandler = async (req, res) => {
  const { artifactId } = req.params;
  const user = res.locals.user;

  const parseResult = objectIdSchema.safeParse(artifactId);

  if (!parseResult.success) {
    throw httpErrors.badRequest(z.prettifyError(parseResult.error));
  }

  const artifact = await ArtifactModel.findOne({
    _id: artifactId,
    "metadata.createdBy": user._id,
  });

  if (!artifact) {
    throw httpErrors.notFound("Artifact not found");
  }

  const populatedHTML = ArtifactService.injectData(
    ArtifactService.sanitizeHTML(artifact.content)
  );

  return res.status(200).json(
    createResponse<GetArtifactResponse>({
      ...artifact.toJSON(),
      content: populatedHTML,
    })
  );
};

export const createArtifactShareLink: AsyncHandler = async (req, res) => {
  const { artifactId } = req.body;
  const user = res.locals.user;

  const parseResult = objectIdSchema.safeParse(artifactId);

  if (!parseResult.success) {
    throw httpErrors.badRequest(z.prettifyError(parseResult.error));
  }

  const artifact = await ArtifactModel.findOne({
    _id: artifactId,
    "metadata.createdBy": user._id,
  });

  if (!artifact) {
    throw httpErrors.notFound("Artifact not found");
  }

  const token = crypto.randomBytes(12).toString("base64url");

  artifact.metadata.sharedToken = { token };
  await artifact.save();

  return res.status(200).json(
    createResponse<CreateArtifactShareLinkResponse>({
      token: token,
    })
  );
};

export const getSharedArtifact: AsyncHandler = async (req, res) => {
  const { token } = req.params;

  if (!token || typeof token !== "string") {
    throw httpErrors.badRequest("Invalid share token");
  }

  const artifact = await ArtifactModel.findOne({
    "metadata.sharedToken.token": token,
  });

  if (!artifact) {
    throw httpErrors.notFound("Shared artifact not found");
  }

  const populatedHTML = ArtifactService.injectData(artifact.content);

  return res.status(200).json(
    createResponse<GetSharedArtifactResponse>({
      content: populatedHTML,
    })
  );
};
