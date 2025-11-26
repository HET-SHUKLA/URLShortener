import { FastifyInstance } from "fastify";
import {
    handleGetUser,
    handleUserCreate,
} from "./users.controller"

const userRoutes = (fastify: FastifyInstance, opt: object) => {
    // GET
    fastify.get("/", handleGetUser);

    //POST
    fastify.post("/", handleUserCreate);
}

export default userRoutes;