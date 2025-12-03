import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { createUserUsingEmailService } from "./auth.service";
import { badRequest, created, ok } from "../../lib/response";
import { InternalServerError } from "../../lib/error";
import { getHeaderString } from "../../util/header";
import { config } from "../../config/env.config";

const handleMeAuth = () => {

}

const handleUserRegister = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = emailAuthInputSchema.parse(req.body);

    const res = await createUserUsingEmailService(body);

    const clientType = getHeaderString(req.headers['x-client-type'])?.trim().toLowerCase();

    if (!clientType) {
        return badRequest(reply, "X-Client-Type header is missing!");
    }

    if (!["mobile", "web"].includes(clientType)) {
        return badRequest(reply, "X-Client-Type header is invalid!");
    }

    const isMobile = clientType === "mobile";

    if(isMobile) {
        return created(reply, "User created successfully", res);
    }

    const refreshToken = res.refreshToken;
    reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production" || config.NODE_ENV === "staging",
        sameSite: "lax",
        path: "/api/v1/auth",
        maxAge: 60 * 60 * 24 * 7 // 7 days
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