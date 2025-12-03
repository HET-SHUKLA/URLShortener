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
    const clientRaw = req.headers['x-client-type'];

    req.log.info(
        {clientRaw},
        "POST /auth/register - Request received"
    )

    const body = emailAuthInputSchema.parse(req.body);

    const clientType = getHeaderString(clientRaw)?.trim().toLowerCase();

    if (!clientType) {
        req.log.warn(
            { email: body.email },
            "POST /auth/register - missing X-Client-Type header"
        );

        return badRequest(reply, "X-Client-Type header is missing!");
    }

    if (!["mobile", "web"].includes(clientType)) {
        req.log.warn(
            { email: body.email, clientType },
            "POST /auth/register - invalid X-Client-Type header"
        );
        return badRequest(reply, "X-Client-Type header is invalid!");
    }

    const isMobile = clientType === "mobile";

    req.log.info(
        { email: body.email, clientType },
        "POST /auth/register - creating user"
    );

    const res = await createUserUsingEmailService(body);

    if(isMobile) {
        req.log.info(
            { userId: res.id },
            "POST /auth/register - user created (mobile)"
        );

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

    req.log.info(
        { userId: res.id },
        "POST /auth/register - user created (web), refresh token cookie set"
    );

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