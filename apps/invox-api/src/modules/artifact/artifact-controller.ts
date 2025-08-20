import { ArtifactModel } from "~/models/artifacts-model";
import {
  createResponse,
  httpErrors,
  objectIdSchema,
  tryCatch,
} from "@repo/lib";
import { AsyncHandler } from "~/types";
import { z } from "zod";
import {
  CreateArtifactShareLinkResponse,
  GetArtifactResponse,
  GetSharedArtifactResponse,
} from "@repo/shared-types";
import {
  ArtifactService,
  DUMMY_INVOICE_DATA,
} from "~/services/artifact-service";
import crypto from "crypto";
import archiver from "archiver";

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

const sanitizeFileName = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9_\-.]/g, "_") // replace anything not safe for filenames
    .replace(/^_+|_+$/g, "")
    .slice(0, 64) || "artifact";

export const downloadArtifact: AsyncHandler = async (req, res) => {
  const { artifactId } = req.params;

  try {
    objectIdSchema.parse(artifactId);
  } catch {
    throw httpErrors.badRequest("Invalid artifact id");
  }

  const artifact = await ArtifactModel.findById(artifactId);

  if (!artifact) {
    throw httpErrors.notFound("Artifact not found");
  }

  const artifactName = sanitizeFileName(artifact.name || "artifact");
  const version = artifact.version || "v1";

  const templateFileName = `${artifactName}-${version}-template.handlebars`;
  const previewFileName = `${artifactName}-${version}-preview.html`;
  const payloadFileName = `${artifactName}-${version}-payload.json`;

  const populatedHTML = ArtifactService.injectData(artifact.content);

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${artifactName}-${version}.zip"`
  );

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(res);

  archive.append(artifact.content, { name: templateFileName });
  archive.append(populatedHTML, { name: previewFileName });
  archive.append(JSON.stringify(DUMMY_INVOICE_DATA, null, 2), {
    name: payloadFileName,
  });

  const { error } = await tryCatch(
    new Promise<void>((resolve, reject) => {
      archive.on("error", (err: unknown) => {
        reject(err);
      });
      res.on("close", () => {
        resolve();
      });
      archive.finalize();
    })
  );

  if (error) {
    throw httpErrors.internal();
  }
};
