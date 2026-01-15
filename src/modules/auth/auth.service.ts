import { createEmailSendingJob } from "../../jobs/email/queue.bullmq";
import { AuthError, InternalServerError, NotFoundError } from "../../lib/error";
import { hashPassword } from "../../lib/password";
import { createEmailTemplate, EmailTemplateEnum } from "../../jobs/email/template";
import { generateRefreshToken, hashToken, generateAccessToken, generateVerificationToken, getUserIdFromAccessToken } from "../../util/tokens";
import { createUserWithEmail, getUserFromUserId, verifyToken } from "./auth.repository";
import { UserCreatedResponse, UserDTO } from "./auth.types";
import { EmailAuthInput, SessionInputSchema } from "./auth.validators";
import { EMPTY_STRING } from "../../constants";

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

    const emailVerificationToken = generateVerificationToken();

    const userId = await createUserWithEmail(param, sessionSchema, emailVerificationToken);

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
    const template = createEmailTemplate(EmailTemplateEnum.VerifyEmail, param.email, userId, emailVerificationToken);
    // Temporary
    template.to = "shuklahet2704@gmail.com";
    createEmailSendingJob(template);

    return response;
}

export const getUserFromAccessTokenService = async (token: string): Promise<UserDTO> => {
    const userId = getUserIdFromAccessToken(token);

    if (!userId) {
        throw new AuthError("Token is expired or invalid");
    }

    const data = await getUserFromUserId(userId);

    if (!data) {
        throw new NotFoundError("User does not exists!");
    }

    return data;
}

export const verifyEmailAddressService = async (token: string): Promise<boolean> => {
    return await verifyToken(token);
}