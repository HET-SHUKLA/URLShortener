import { createEmailSendingJob } from "../../jobs/email/queue.bullmq";
import { AuthError, InternalServerError, NotFoundError } from "../../lib/error";
import { hashPassword, verifyPassword } from "../../lib/password";
import { createEmailTemplate, EmailTemplateEnum } from "../../jobs/email/template";
import { generateRefreshToken, hashToken, generateAccessToken, generateVerificationToken, getUserIdFromAccessToken } from "../../util/tokens";
import { createUserWithEmail, getUserFromEmail, getUserFromUserId, storeDataInSession, verifyToken } from "./auth.repository";
import { UserCreatedResponse, UserDTO } from "./auth.types";
import { AuthSchema, EmailAuthInput, SessionInputSchema } from "./auth.validators";
import { EMPTY_STRING } from "../../constants";
import { AuthProvider } from "../../generated/prisma/enums";

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

/**
 * Service to login user with Email and Password
 * @param param EmailAuthInput
 * @param userAgent UserAgent - string | null
 * @param ip ipAddress of the User
 * @returns UserCreatedResponse
 */
export const loginUserUsingEmailPassword = async (param: EmailAuthInput, userAgent: string | null, ip: string | null): Promise<UserCreatedResponse> => {
    // DB call to fetch user data based on email address
    const data = await getUserFromEmail(param.email);

    if (!data || !data.password) {
        throw new AuthError("Email or Password is incorrect");
    }

    const isPasswordCorrect = await verifyPassword(param.password, data.password);

    if (!isPasswordCorrect) {
        // Always send generalize message even if we know Email is correct here.
        throw new AuthError("Email or Password is incorrect");
    }

    const refreshToken = generateRefreshToken();
    const accessToken = generateAccessToken(data.userId);

    if (!refreshToken || !accessToken) {
        throw new InternalServerError();
    }

    const tokenHash = hashToken(refreshToken);

    const sessionSchema: SessionInputSchema = {
        tokenHash,
        userAgent,
        ip
    }

    const authSchema: AuthSchema = {
        ...param,
        authProvider: AuthProvider.EMAIL
    }

    const userId = await storeDataInSession(authSchema, sessionSchema, data.userId);

    if (!userId) {
        throw new InternalServerError();
    }

    const response: UserCreatedResponse = {
        id: userId,
        accessToken,
        refreshToken,
    };

    return response;
}

/**
 * Service to fetch User's data based on Access token
 * @param token Access token
 * @returns UserDTO object
 */
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

/**
 * Service to verify email address based on Verification token
 * @param token Verification token
 * @returns boolean
 */
export const verifyEmailAddressService = async (token: string): Promise<boolean> => {
    return await verifyToken(token);
}

export const userLogoutService = async (allSession: boolean, refreshToken: string): Promise<boolean> => {

}