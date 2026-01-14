import { EMAIL, FORWARD_SLACE, VERIFICATION_URL } from "../../constants";
import { generateVerificationToken } from "../../util/tokens";

export enum EmailTemplateEnum {
    VerifyEmail = "VERIFY_EMAIL",
    ResetPassowrd = "RESET_PASSWORD"
}

export interface EmailTemplate {
    to: string,
    subject: string,
    body: string,
    idempotencyKey: string
}

/**
 * Function to create email body
 * @param template Template for body creation
 * @param email Email address
 * @param data Optional data
 */
export const createEmailTemplate = (template: EmailTemplateEnum, email: string, userId: string, token: string, data?: any) => {
    let body: EmailTemplate;
    switch(template) {
        case EmailTemplateEnum.VerifyEmail :
            body = createVerifyEmailBody(email, userId, token);
            break;
        case EmailTemplateEnum.ResetPassowrd :
            body = createResetPasswordBody(email, userId, token);
            break;
        default:
            body = {
                to: email, 
                subject: "Welcome to URL Shortener", 
                body: "<h1>Welcome to URL Shortener</h1>",
                idempotencyKey: `default-key:${userId}`
            };
            break;
    }

    return body;
}

// TODO: Generate links
/**
 * Helper function to create email body for email verification
 * @param email Email address
 */
const createVerifyEmailBody = (email: string, userId: string, token: string): EmailTemplate => {
    const fullUrl = VERIFICATION_URL + EMAIL + FORWARD_SLACE + token; 
    const body = `<h1>Verify Email Address</h1></br><h2>Click on below link to verify</h2></br><h2><a href='${fullUrl}'>Click to Verify Email Address</a></h2>`;

    const template: EmailTemplate = {
        to: email,
        subject: "URL Shortener - Email verification",
        body,
        idempotencyKey: `verify-email-${userId}`
    }

    return template;
}

/**
 * Helper function to create email body for password reset
 * @param email Email address
 */
const createResetPasswordBody = (email: string, userId: string, token: string): EmailTemplate => {
    const body = "<h1>Reset Password</h1></br><p>Click on below link to reset password</p></br><a href='https://google.com'>Link</a>";

    const template: EmailTemplate = {
        to: email,
        subject: "URL Shortener - Reset password",
        body,
        idempotencyKey: `reset-password-${userId}`
    }

    return template;
}