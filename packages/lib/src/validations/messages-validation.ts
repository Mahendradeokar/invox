import z from "zod";
import { objectIdSchema } from "./misc";

export const createMessageSchema = z.object({
  content: z.object({
    contentType: z.enum(["text"]),
    parts: z.array(z.string()),
  }),
  projectId: objectIdSchema,
  artifactId: z.string(),
  role: z.enum(["assistant", "user"]),
});

export const getProjectMessageSchema = z.object({
  projectId: objectIdSchema,
});
