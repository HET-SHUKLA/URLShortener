import { FastifyInstance } from "fastify";
import {
    handleMeAuth,
    handleUserRegister,
    handleGoogleAuth,
    handleRefreshToken,
    handleUserLogin,
    handleUserLogout,
    handleSessionLogout
} from "./auth.controller"

const authRoutes = (fastify: FastifyInstance, opt: object) => {
    // GET
    fastify.get("/me", handleMeAuth);

    //POST
    fastify.post("/register", handleUserRegister);
    fastify.post("/google", handleGoogleAuth);
    fastify.post("/refresh", handleRefreshToken);
    fastify.post("/login", handleUserLogin);

    // In v1.1.0
    // fastify.post("/reset-password", handleResetPassword);
    // fastify.post("/reset-password?tokenId&token", handleNewPassword);

    //DELETE
    fastify.delete("/logout", handleUserLogout);
    fastify.delete("/logout/:sessionId", handleSessionLogout);
}

export default authRoutes;