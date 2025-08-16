import { httpErrors } from "@repo/lib";
import { createMessageSchema } from "@repo/lib";
import { API } from "../api-client";
import z from "zod";
import { CreateMessageResponse } from "@repo/shared-types";
import { errorResult } from "../utils";

// export const getProjectMessages = (
//   projectId: z.infer<typeof getProjectMessageSchema.shape.projectId>
// ) => {
//   const valid = getProjectMessageSchema.safeParse({ projectId });

//   if (!valid.success) {
//     return errorResult(
//       httpErrors.badRequest(z.prettifyError(valid.error)).toResponse()
//     );
//   }

//   return API.makeRequest("get", `/projects/${projectId}/messages`);
// };

export const createMessage = (payload: z.infer<typeof createMessageSchema>) => {
  const valid = createMessageSchema.safeParse(payload);
  if (!valid.success) {
    return errorResult(
      httpErrors.badRequest(z.prettifyError(valid.error)).toResponse()
    );
  }
  return API.makeRequest<CreateMessageResponse>("post", "/messages", payload);
};
