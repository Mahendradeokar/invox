import { objectIdSchema } from "@repo/lib";
import z from "zod";

export const createMessageSchema = z.object({
  content: z.object({
    contentType: z.enum(["text"]),
    parts: z.array(z.string()),
  }),
  projectId: objectIdSchema,
  artifactId: z.string(),
  role: z.enum(["assistant", "user"]),
});
