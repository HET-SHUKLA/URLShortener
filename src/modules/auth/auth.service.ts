import { AuthError, InternalServerError } from "../../lib/error";
import { hashPassword } from "../../lib/password";
import { generateRefreshToken, hashToken, generateAccessToken } from "../../util/tokens";
import { createUserWithEmail } from "./auth.repository";
import { UserCreatedResponse } from "./auth.types";
import { EmailAuthInput, SessionInputSchema } from "./auth.validators";

// export const authenticateUserWithEmail = async (param: EmailAuthInput) => {
//     const record = await findUserAuthByEmail(param.email);

//     if (!record || !record.password) {
//         throw new AuthError("Email or Password is invalid!");
//     }

//     const isValid = verifyPassword(param.password, record.password);

//     if (!isValid) {
//         throw new AuthError("Email or Password is invalid!");
//     }

//     return {
//         userId: record.userId,
//         email: record.email,
//     };
// }

export const createUserUsingEmailService = async (param: EmailAuthInput, userAgent: string | null, ip: string | null): Promise<UserCreatedResponse> => {
    const refreshToken = generateRefreshToken();

    if (!refreshToken) {
        throw new InternalServerError();
    }

    const tokenHash = hashToken(refreshToken);

    const sessionSchema: SessionInputSchema = {
        tokenHash,
        userAgent,
        ip
    }

    // FIX: Instead of this, We might receive only hash password, since password is sensitive and we can not send that using req.body
    param.password = await hashPassword(param.password);

    const userId = await createUserWithEmail(param, sessionSchema);
    
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