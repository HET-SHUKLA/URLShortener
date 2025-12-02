import { AuthError } from "../../lib/error";
import { verifyPassword } from "../../lib/password";
import { generateRefreshToken, hashToken, generateAccessToken } from "../../util/tokens";
import { createUserForEmail, findUserAuthByEmail } from "./auth.repository";
import { UserCreatedResponse } from "./auth.types";
import { EmailAuthInput } from "./auth.validators";

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

const createUserUsingEmailService = async (param: EmailAuthInput): Promise<UserCreatedResponse | undefined> => {
    const refreshToken = generateRefreshToken();

    if (!refreshToken) {
        return undefined;
    }

    const hashedRefreshToken = hashToken(refreshToken);

    const userId = await createUserForEmail(param, hashedRefreshToken);
    
    if (!userId) {
        return undefined;
    }

    const accessToken = generateAccessToken(userId);

    if (!accessToken) {
        return undefined;
    }

    const response: UserCreatedResponse = {
        id: userId,
        accessToken,
        refreshToken,
    };

    return response;
}

export {
    authenticateUserWithEmail,
    createUserUsingEmailService
}
