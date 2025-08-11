import { createProjectSchema } from "@repo/lib";
import { API } from "../api-client";
import z from "zod";
import { CreateProjectResponse, GetProjectsResponse } from "@repo/shared-types";

import { getProjectsQuerySchema } from "@repo/lib";

export const getProjectList = (
  payload: z.infer<typeof getProjectsQuerySchema>
) => {
  const valid = getProjectsQuerySchema.safeParse({
    page: payload.page.toString(),
    limit: payload.limit.toString(),
  });

  if (!valid.success) {
    throw new Error(z.prettifyError(valid.error));
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
    throw new Error(z.prettifyError(valid.error));
  }
  return API.makeRequest<CreateProjectResponse>(
    "post",
    "/projects/create",
    payload
  );
};
