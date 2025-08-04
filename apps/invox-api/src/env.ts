import { z } from "zod";
import dotenv from "dotenv";

const mode = process.env.NODE_ENV || "development";
const envFiles = [`.env.${mode}`, ".env"];

dotenv.config({ path: envFiles });

const envSchema = z.object({
  PORT: z.string().default("5001"),
  MONGODB_URL: z.string().min(1, { message: "MONGODB_URL is required" }),
  DB_NAME: z.string().min(1, { message: "DB_NAME is required" }),
  API_BASE_URL: z.string().min(1, { message: "API_BASE_URL is required" }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("; ");
  throw new Error(`Invalid environment variables: ${errors}`);
}

export default Object.freeze(parsed.data);
