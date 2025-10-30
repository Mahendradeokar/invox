import { z } from "zod";
import dotenv from "dotenv";

const mode = process.env.NODE_ENV || "development";

// `/etc/secrets/.env.${mode}` for production deployment only -
const envFiles = [`/etc/secrets/.env.${mode}`, `.env.${mode}`, ".env"];

if (mode !== "production") {
  dotenv.config({ path: envFiles });
}

console.log(
  "Current path:",
  process.cwd(),
  JSON.stringify(process.env, null, 2)
);

const envSchema = z.object({
  PORT: z.string().default("5001"),
  MONGODB_URL: z.string().min(1, { message: "MONGODB_URL is required" }),
  DB_NAME: z.string().min(1, { message: "DB_NAME is required" }),
  API_BASE_URL: z.string().min(1, { message: "API_BASE_URL is required" }),
  INIT_WITH_DUMMY_DATA: z.union([z.literal("0"), z.literal("1")]),
  OPENROUTER_API_KEY: z
    .string()
    .min(1, { message: "OPENROUTER_API_KEY is required" }),
  IP_RATE_LIMIT_WINDOW_IN_MS: z.string(),
  IP_RATE_LIMIT_REQ: z.string(),
  USER_RATE_LIMIT_WINDOW_IN_MS: z.string(),
  USER_RATE_LIMIT_REQ: z.string(),
  AI_API_RATE_LIMIT_WINDOW_IN_MS: z.string(),
  AI_API_RATE_LIMIT_REQ: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues
    .map((e) => `${e.path.join(".")}: ${e.message}`)
    .join("; ");
  throw new Error(`Invalid environment variables: ${errors}`);
}

export default Object.freeze(parsed.data);
