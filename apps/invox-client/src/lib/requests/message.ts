import { getProjectMessageSchema } from "@repo/lib";
import { createMessageSchema } from "@repo/lib";
import { API } from "../api-client";
import z from "zod";

export const getProjectMessages = (
  projectId: typeof getProjectMessageSchema
) => {
  const valid = getProjectMessageSchema.safeParse({ projectId });

  if (valid.error) {
    throw new Error(z.prettifyError(valid.error));
  }

  return API.makeRequest("get", "/projects");
};

export const createMessage = (payload: typeof createMessageSchema) => {
  const valid = createMessageSchema.safeParse(payload);
  if (!valid.success) {
    throw new Error(z.prettifyError(valid.error));
  }
  return API.makeRequest("post", "/messages", payload);
};
