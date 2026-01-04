import { z } from "zod";
import dotenv from "dotenv";

// Load environment file based on parameter or default to .env.local
dotenv.config({
  path: process.env.ENV_FILE || ".env.local",
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  POSTGRES_USER: z.string({
    error: "POSTGRES_USER is required",
  }),

  POSTGRES_PASSWORD: z.string({
    error: "POSTGRES_PASSWORD is required",
  }),

  POSTGRES_DB: z.string({
    error: "POSTGRES_DB is required",
  }),

  DATABASE_URL: z.string({
    error: "DATABASE_URL is required",
  }),

  REDIS_URL: z.string({
    error: "REDIS_URL is required",
  }),

  DATABASE_URL_LOCALHOST: z.string().optional(),

  LOG_LEVEL: z.string().default("info"),

  JWT_SECRET: z.string({
    error: "JWT_SECRET is required",
  }),

  JWT_EXPIRES_IN: z.coerce.number({
    error: "JWT_EXPIRES_IN required",
  }),

  REFRESH_TOKEN_TTL_DAYS: z.coerce.number({
    error: "REFRESH_TOKEN_TTL_DAYS required",
  }),

  COOKIE_SECRET: z.string({
    error: "COOKIE_SECRET required",
  }),
  
  SERVICE: z.string().default("url_shortener_backend"),

  AWS_SECRET_ACCESS_KEY: z.string({
    error: "AWS_SECRET_ACCESS_KEY is required",
  }),

  AWS_ACCESS_KEY_ID: z.string({
    error: "AWS_ACCESS_KEY_ID is required",
  }),

  AWS_SES_REGION: z.string({
    error: "AWS_SES_REGION is required",
  }),

  SEND_EMAIL_FROM: z.string({
    error: "SEND_EMAIL_FROM is required",
  })
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("----------- ENVIRONMENT VARIABLE NOT FOUND -----------");
  console.error(parsed.error);
  console.error("Exiting...!");
  process.exit(1);
}

export const config = parsed.data;
