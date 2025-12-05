import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { createUserUsingEmailService } from "./auth.service";
import { badRequest, created, ok } from "../../lib/response";
import { getHeaderString } from "../../util/header";
import { config } from "../../config/env.config";
import { logInfo } from "../../lib/logger";
import { AUTH_REGISTER_REQUEST, AUTH_USER_CREATED, AUTH_USER_CREATING } from "../../constants";

export const handleMeAuth = () => {

}

export const handleUserRegister = async (req: FastifyRequest, reply: FastifyReply) => {
    const clientRaw = req.headers['x-client-type'];

    logInfo(
        reply,
        AUTH_REGISTER_REQUEST,
        "User registration request receieved",
        {
            route: reply.request?.routeOptions.url
        }
    )

    const body = emailAuthInputSchema.parse(req.body);

    const clientType = getHeaderString(clientRaw)?.trim().toLowerCase();

    if (!clientType) {
        return badRequest(reply, "X-Client-Type header is missing!");
    }

    if (!["mobile", "web"].includes(clientType)) {
        return badRequest(reply, "X-Client-Type header is invalid!");
    }

    const isMobile = clientType === "mobile";

    logInfo(
        reply,
        AUTH_USER_CREATING,
        "User creation has been started",
    )

    const res = await createUserUsingEmailService(body);

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

    logInfo(
        reply,
        AUTH_USER_CREATED,
        "User successfully created, Refresh token Cookie set",
    )

    return created(reply, "User created successfully", {
        "id": res.id,
        "accessToken": res.accessToken,
    });

}

export const handleGoogleAuth = () => {

}

export const handleRefreshToken = () => {

}

export const handleUserLogin = () => {

}

export const handleUserLogout = () => {

}

export const handleSessionLogout = () => {

}
