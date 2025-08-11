import { GetAllTemplatesResponse } from "@repo/shared-types";
import { API } from "../api-client";

export const getTemplates = () => {
  return API.makeRequest<GetAllTemplatesResponse>("get", "/templates");
};
