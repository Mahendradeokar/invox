import { GetAllTemplatesResponse } from "@repo/shared-types";
import { API, APIClientOptions } from "../api-client";

export const getTemplates = (options: APIClientOptions) => {
  return API.makeRequest<GetAllTemplatesResponse>(
    "get",
    "/templates",
    null,
    options
  );
};
