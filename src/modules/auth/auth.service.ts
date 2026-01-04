import { createEmailSendingJob } from "../../jobs/producer";
import { AuthError, InternalServerError } from "../../lib/error";
import { hashPassword } from "../../lib/password";
import { createEmailTemplate, EmailTemplateEnum } from "../../util/emailBody";
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

/**
 * Service function to create user with Email and Password
 * @param param EmailAuthInput instance
 * @param userAgent User agent from request object
 * @param ip Ip address of request
 * @returns Returns UserCreatedResponse
 */
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

    // Job to send email
    const template = createEmailTemplate(EmailTemplateEnum.VerifyEmail, param.email);
    createEmailSendingJob(template);

    return response;
}