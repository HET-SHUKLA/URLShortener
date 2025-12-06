import { AuthError, InternalServerError } from "../../lib/error";
import { hashPassword, verifyPassword } from "../../lib/password";
import { generateRefreshToken, hashToken, generateAccessToken } from "../../util/tokens";
import { createUserForEmail, findUserAuthByEmail } from "./auth.repository";
import { UserCreatedResponse } from "./auth.types";
import { EmailAuthInput } from "./auth.validators";

export const authenticateUserWithEmail = async (param: EmailAuthInput) => {
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

export const createUserUsingEmailService = async (param: EmailAuthInput): Promise<UserCreatedResponse> => {
    const refreshToken = generateRefreshToken();

    if (!refreshToken) {
        throw new InternalServerError();
    }

    const hashedRefreshToken = hashToken(refreshToken);

    param.password = await hashPassword(param.password);

    const userId = await createUserForEmail(param, hashedRefreshToken);
    
    if (!userId) {
        throw new InternalServerError();
    }

    const accessToken = generateAccessToken(userId);

    if (!accessToken) {
        throw new InternalServerError();
    }

    const response: UserCreatedResponse = {
        id: userId,
        accessToken,
        refreshToken,
    };

    // TODO: Start a Job to send verification email link

    return response;
}