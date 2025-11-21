import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment file based on parameter or default to .env.local
dotenv.config({
    path: process.env.ENV_FILE || '.env.local',
});

const envSchema = z.object({

    NODE_ENV: z.enum(['development', 'staging', 'production']).default("development"),

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
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.error("----------- ENVIRONMENT VARIABLE NOT FOUND -----------");
    console.error(parsed.error.format());
    console.error("Exiting...!");
    process.exit(1);
}

export const config = parsed.data;