import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { authenticateUserWithEmail } from "./auth.service";
import { badRequest, ok } from "../../lib/response";

export const handleUserAuthWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = emailAuthInputSchema.parse(req.body);
    const response = await authenticateUserWithEmail(body);
    if (response) {
        // TODO: Need to return Authorized response
        return ok(reply, {
            email: response.email,
            userId: response.userId
        });
    }

    // TODO: For testing purposes, Need to return Unauthorized.
    return badRequest(reply, "Unauthorized");
}
