import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  selectedTemplate: z.string().min(1, "Selected template is required"),
});
