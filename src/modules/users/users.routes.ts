import { FastifyInstance } from "fastify";
import {
    handleGetUser,
    handleUserCreate,
} from "./users.controller"
import { deleteUserSchema, userMeSchema, userSessionsSchema, userVerifyEmailSchema } from "./user.schema";

const userRoutes = (fastify: FastifyInstance, opt: object) => {
    // GET
    fastify.get("/me", {
        schema: userMeSchema,
        handler: handleGetUser
    });

    fastify.get("/sessions", {
        schema: userSessionsSchema,
        handler: handleGetUser
    });

    fastify.get("/me", {
        schema: userVerifyEmailSchema,
        handler: handleGetUser
    });

    // PATCH

    // DELETE
    fastify.delete("/me", {
        schema: deleteUserSchema,
        handler: handleGetUser
    });
}

export default userRoutes;