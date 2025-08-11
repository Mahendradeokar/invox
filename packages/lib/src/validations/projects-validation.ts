import { z } from "zod";

export const getProjectsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val ?? "1", 10);
      return isNaN(num) || num < 1 ? 1 : num;
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val ?? "10", 10);
      if (isNaN(num) || num < 1) return 1;
      if (num > 100) return 100;
      return num;
    }),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  selectedTemplate: z.string().min(1, "Selected template is required"),
});
