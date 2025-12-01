import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { authenticateUserWithEmail } from "./auth.service";
import { badRequest, ok } from "../../lib/response";

const handleMeAuth = () => {
    
}
const handleUserRegister = () => {
    
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