import { FastifyInstance } from "fastify";
import { getUrlSchema, postUrlSchema } from "./url.schema";

const urlRoutes = (fastify: FastifyInstance, opt: object) => {
    // POST
    fastify.post("/", {
        schema: postUrlSchema,
        handler: () => {}
    });

    fastify.get("/:id", {
        schema: getUrlSchema,
        handler: () => {}
    });
}

export default urlRoutes;