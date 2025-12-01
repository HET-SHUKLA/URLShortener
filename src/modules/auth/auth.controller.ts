import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { createUserUsingEmailService } from "./auth.service";
import { badRequest, ok } from "../../lib/response";

const handleMeAuth = () => {

}

const handleUserRegister = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = emailAuthInputSchema.parse(req.body);

    const res = await createUserUsingEmailService(body);

    // if (!res) {
    //     throw new 
    // }
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