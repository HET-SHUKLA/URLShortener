import { buildApp } from "./app";
import { config } from "./config/env.config";
import { initPrisma } from "./db/prisma";
import { initRedis } from "./db/redis";
import { logError, logSuccess } from "./lib/logger";

const app = buildApp();

// pg Pool
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// // redis client
// const redisClient = createClient({
//   url: process.env.REDIS_URL ?? 'redis://localhost:6379',
// });

// fastify.decorate('pg', pool);
// fastify.decorate('redis', redisClient);

// // On close
// fastify.addHook('onClose', async () => {
//   await pool.end();
//   await redisClient.quit();
// });

// fastify.get('/', async (request, reply) => {
//   return reply.send("<h1>Hello world</h1>")
// });

// // Test Postgres route
// fastify.get('/db-test', async (request, reply) => {
//   const result = await pool.query('SELECT * FROM urls');
//   return reply.send({ urls: result.rows });
// });

// // Test Redis route
// fastify.get('/redis-test', async (request, reply) => {
//   await redisClient.set('test-key', 'hello-from-redis', { EX: 60 });
//   const value = await redisClient.get('test-key');
//   return reply.send({ value });
// });

/**
 * Run the server!
 */
const start = async () => {
  try {
    await initPrisma();
    logSuccess("Prisma connected!");

    await initRedis();
    logSuccess("Redis connected!");

    await app.listen({ port: config.PORT, host: "0.0.0.0" });
    logSuccess("Server started!");
  } catch (err) {
    logError("While starting server => ", err);
    process.exit(1);
  }
};
start();
