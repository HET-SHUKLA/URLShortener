import { FastifyInstance } from "fastify";
import {
    handleMeAuth,
    handleUserRegister,
    handleGoogleAuth,
    handleRefreshToken,
    handleUserLogin,
    handleUserLogout,
    handleSessionLogout,
    handleVerificationLinkSend,
    handleEmailVerification
} from "./auth.controller"
import { authRateLimitHook } from "./auth.hook";
import { loginSchema } from "./auth.schema";

/**
 * Routes for '/api/v1/auth'
 * @param fastify Fastify Instance
 */
const authRoutes = async (fastify: FastifyInstance) => {
    // Hooks
    fastify.addHook("onRequest", authRateLimitHook);

    // GET
    fastify.get("/me", handleMeAuth);

    //POST
    fastify.post("/register", { 
        schema: loginSchema,
        handler: handleUserRegister 
    });
    fastify.post("/google", handleGoogleAuth);
    fastify.post("/refresh", handleRefreshToken);
    fastify.post("/login", handleUserLogin);
    fastify.post("/verify", handleVerificationLinkSend);
    fastify.post("/verify-email/:id", handleEmailVerification);

    // In v1.1.0
    // fastify.post("/reset-password", handleResetPassword);
    // fastify.post("/reset-password?tokenId&token", handleNewPassword);

    // DELETE
    fastify.delete("/logout", handleUserLogout);
    fastify.delete("/logout/:sessionId", handleSessionLogout);
}

export default authRoutes;