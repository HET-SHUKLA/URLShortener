import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { createUserUsingEmailService } from "./auth.service";
import { badRequest, created, ok } from "../../lib/response";
import { InternalServerError } from "../../lib/error";

const handleMeAuth = () => {

}

const handleUserRegister = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = emailAuthInputSchema.parse(req.body);

    const res = await createUserUsingEmailService(body);

    const clientType = req.headers['x-client-type'];

    if (!clientType) {
        return badRequest(reply, "X-Client-Type header is missing!");
    }

    if (!res) {
        throw new InternalServerError("We are unable to complete your request, Please try again!");
    }

    const isMobile = clientType === "mobile";

    if(isMobile) {
        return created(reply, "User created successfully", res);
    }

    const refreshToken = res.refreshToken;
    reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/api/v1/auth"
    });

    return created(reply, "User created successfully", {
        "id": res.id,
        "accessToken": res.accessToken,
    });

}

const handleGoogleAuth = () => {

}

const handleRefreshToken = () => {

}

const handleUserLogin = () => {

}

const handleUserLogout = () => {

}

const handleSessionLogout = () => {

}

export {
    handleMeAuth,
    handleUserRegister,
    handleGoogleAuth,
    handleRefreshToken,
    handleUserLogin,
    handleUserLogout,
    handleSessionLogout
}