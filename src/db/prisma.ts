import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../config/env.config";

const connectionString = config.DATABASE_URL_LOCALHOST ?? config.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

export async function initPrisma() {
  await prisma.$connect();
}

export async function shutDownPrisma() {
  await prisma.$disconnect();
}
