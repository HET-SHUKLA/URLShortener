import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { authenticateUserWithEmail } from "./auth.service";
import { badRequest, ok } from "../../lib/response";

const handleUserSignInWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
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

export {
    handleUserSignInWithEmail,
}

// In later versions, Not in v1.0.0

// const handleUserAuthWithGoogle = async (req: FastifyRequest, reply: FastifyReply) => {    
//     const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_url}&response_type=code&scope=profile email`;

//     return ok(reply, {redirectUrl: url});
// }

// const handleGoogleRedirect = async (req: FastifyRequest, reply: FastifyReply) => {
//     const { code } = req.query;

//     const profile = await authenticateUserWithGoogle(code);

//     if (!profile) {
//         // TODO: For testing purpose
//         return badRequest(reply, "Something went wrong");
//     }

//     return 
// }