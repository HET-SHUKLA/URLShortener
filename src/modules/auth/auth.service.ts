import { AuthError } from "../../lib/error";
import { verifyPassword } from "../../lib/password";
import { createUserForEmail, findUserAuthByEmail } from "./auth.repository";
import { UserCreatedResponse } from "./auth.types";
import { EmailAuthInput } from "./auth.validators";
import jsonwebtoken from "jsonwebtoken";

const authenticateUserWithEmail = async (param: EmailAuthInput) => {
    const record = await findUserAuthByEmail(param.email);

    if (!record || !record.password) {
        throw new AuthError("Email or Password is invalid!");
    }

    const isValid = verifyPassword(param.password, record.password);

    if (!isValid) {
        throw new AuthError("Email or Password is invalid!");
    }

    return {
        userId: record.userId,
        email: record.email,
    };
}

const createUserUsingEmailService = async (param: EmailAuthInput): Promise<UserCreatedResponse | boolean> => {
    //const refreshToken = await generateRefreshToken();

    // if (!refreshToken) {
    //     return false;
    // }

    // const userId = await createUserForEmail(param, refreshToken);
    
    // if (!userId) {
    //     return false;
    // }

    //const accessToken = await genearateAccessToken(userId);

    // if (!accessToken) {
    //     return false;
    // }

    // const response: UserCreatedResponse = {
    //     id: userId,
    //     accessToken,
    //     refreshToken, // Check in controller
    // };

    //return response;
}

export {
    authenticateUserWithEmail,
    createUserUsingEmailService
}