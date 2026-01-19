import { FastifyInstance } from "fastify";
import {
    handleMeAuth,
    handleUserRegister,
    handleGoogleAuth,
    handleRefreshToken,
    handleUserLogin,
    handleUserLogout,
    handleSessionLogout,
    handleVerification
} from "./auth.controller"
import { authRateLimitHook } from "./auth.hook";
import { googleSchema, loginSchema, logoutSchema, logoutSessionSchema, meSchema, refreshSchema, registerSchema } from "./auth.schema";

/**
 * Routes for '/api/v1/auth'
 * @param fastify Fastify Instance
 */
const authRoutes = async (fastify: FastifyInstance) => {
    // Hooks
    fastify.addHook("onRequest", authRateLimitHook);

    // GET
    fastify.get("/me", {
        schema: meSchema,
        handler: handleMeAuth
    });
    fastify.get("/verify/:item/:token", handleVerification)

    //POST
    fastify.post("/register", { 
        schema: registerSchema,
        handler: handleUserRegister
    });
    fastify.post("/google", {
        schema: googleSchema,
        handler: handleGoogleAuth
    });
    fastify.post("/refresh", {
        schema: refreshSchema,
        handler: handleRefreshToken
    });
    fastify.post("/login", {
        schema: loginSchema,
        handler: handleUserLogin
    });

    // In v1.1.0
    // fastify.post("/reset-password", handleResetPassword);
    // fastify.post("/reset-password?tokenId&token", handleNewPassword);

    // DELETE
    fastify.delete("/logout/all", {
        schema: logoutSchema,
        handler: handleUserLogout
    });
    fastify.delete("/logout", {
        schema: logoutSchema,
        handler: handleUserLogout
    });
    fastify.delete("/logout/:sessionId", {
        schema: logoutSessionSchema,
        handler: handleSessionLogout
    });
}

export default authRoutes;