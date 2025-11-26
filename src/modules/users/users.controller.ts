import { FastifyReply, FastifyRequest } from "fastify";
import { getUserSchema, userInputSchema } from "./users.validators";
import { getUser, createUser } from "./users.service";
import { NotFoundError } from "../../lib/error";
import { ok } from "../../lib/response";

const handleGetUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = getUserSchema.parse(req.body);

    const user = getUser(body);

    if (!user) {
        throw new NotFoundError("User does not exists!");
    }

    return ok(reply, user);
}

const handleUserCreate = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = userInputSchema.parse(req.body);

    const response = createUser(body);
}

export {
    handleGetUser,
    handleUserCreate,
}