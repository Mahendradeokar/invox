import { objectIdSchema, httpErrors } from "@repo/lib";
import { API } from "../api-client";
import z from "zod";
import {
  GetArtifactResponse,
  CreateArtifactShareLinkResponse,
  GetSharedArtifactResponse,
} from "@repo/shared-types";
import { errorResult } from "../utils";

// Get a single artifact by ID
export const getArtifact = (artifactId: z.infer<typeof objectIdSchema>) => {
  const valid = objectIdSchema.safeParse(artifactId);

  if (!valid.success) {
    return errorResult(
      httpErrors.badRequest(z.prettifyError(valid.error)).toResponse()
    );
  }

  return API.makeRequest<GetArtifactResponse>(
    "get",
    `/artifacts/${artifactId}`
  );
};

export const createArtifactShareLink = (
  artifactId: z.infer<typeof objectIdSchema>
) => {
  const valid = objectIdSchema.safeParse(artifactId);

  if (!valid.success) {
    return errorResult(
      httpErrors.badRequest(z.prettifyError(valid.error)).toResponse()
    );
  }

  return API.makeRequest<CreateArtifactShareLinkResponse>(
    "post",
    `/artifacts/share`,
    { artifactId }
  );
};

export const getSharedArtifact = (token: string) => {
  if (!token || typeof token !== "string") {
    return errorResult(
      httpErrors.badRequest("Invalid share token").toResponse()
    );
  }

  return API.makeRequest<GetSharedArtifactResponse>(
    "get",
    `/artifacts/share/${token}`
  );
};

export const downloadArtifactArchive = async (
  artifactId: z.infer<typeof objectIdSchema>
) => {
  const valid = objectIdSchema.safeParse(artifactId);

  if (!valid.success) {
    return errorResult(
      httpErrors.badRequest(z.prettifyError(valid.error)).toResponse()
    );
  }

  return API.makeRequest<Blob>(
    "get",
    `/artifacts/download/${artifactId}`,
    null,
    {
      responseType: "blob",
    }
  );
};
