import {
  createProjectSchema,
  getProjectsQuerySchema,
  httpErrors,
  objectIdSchema,
} from "@repo/lib";
import { API } from "../api-client";
import z from "zod";
import {
  CreateProjectResponse,
  GetInitialProjectData,
  GetProjectsResponse,
} from "@repo/shared-types";
import { errorResult } from "../utils";

export const getProjectList = (
  payload: z.infer<typeof getProjectsQuerySchema>
) => {
  const valid = getProjectsQuerySchema.safeParse({
    page: payload.page.toString(),
    limit: payload.limit.toString(),
  });

  if (!valid.success) {
    return errorResult(
      httpErrors.badRequest(z.prettifyError(valid.error)).toResponse()
    );
  }

  const params = new URLSearchParams({
    page: valid.data.page.toString(),
    limit: valid.data.limit.toString(),
  }).toString();

  const url = `/projects?${params}`;
  return API.makeRequest<GetProjectsResponse>("get", url);
};

export const createProject = (payload: z.infer<typeof createProjectSchema>) => {
  const valid = createProjectSchema.safeParse(payload);
  if (!valid.success) {
    return errorResult(httpErrors.badRequest(z.prettifyError(valid.error)));
  }
  return API.makeRequest<CreateProjectResponse>(
    "post",
    "/projects/create",
    payload
  );
};

export const getProjectInitialData = (projectId: string) => {
  const valid = objectIdSchema.safeParse(projectId);
  if (!valid.success) {
    return errorResult(httpErrors.badRequest(z.prettifyError(valid.error)));
  }
  const url = `/projects/${projectId}/initial-data`;
  return API.makeRequest<GetInitialProjectData>("get", url);
};
