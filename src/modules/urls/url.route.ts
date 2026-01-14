import { FastifyInstance } from "fastify";
import { deleteUrlSchema, getUrlInfoSchema, getUrlSchema, getUrlStatsSchema, postUrlSchema } from "./url.schema";

const urlRoutes = (fastify: FastifyInstance, opt: object) => {
    // POST
    fastify.post("", {
        schema: postUrlSchema,
        handler: () => {}
    });

    // GET
    fastify.get("/:id", {
        schema: getUrlSchema,
        handler: () => {}
    });

    fastify.get("/get/:id", {
        schema: getUrlInfoSchema,
        handler: () => {}
    });

    fastify.get("/stats/:id", {
        schema: getUrlStatsSchema,
        handler: () => {}
    });

    // DELETE
    fastify.delete("/:id", {
        schema: deleteUrlSchema,
        handler: () => {}
    });
}

export default urlRoutes;