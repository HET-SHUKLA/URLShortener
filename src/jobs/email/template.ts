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
export const createEmailTemplate = (template: EmailTemplateEnum, email: string, userId: string, data?: any) => {
    let body: EmailTemplate;
    switch(template) {
        case EmailTemplateEnum.VerifyEmail :
            body = createVerifyEmailBody(email, userId);
            break;
        case EmailTemplateEnum.ResetPassowrd :
            body = createResetPasswordBody(email, userId);
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
const createVerifyEmailBody = (email: string, userId: string): EmailTemplate => {
    const body = "<h1>Verify Email</h1></br><p>Click on below link to verify</p></br><a href='https://google.com'>Link</a>";

    const template: EmailTemplate = {
        to: email,
        subject: "URL Shortener - Email verification",
        body,
        idempotencyKey: `verify-email:${userId}`
    }

    return template;
}

/**
 * Helper function to create email body for password reset
 * @param email Email address
 */
const createResetPasswordBody = (email: string, userId: string): EmailTemplate => {
    const body = "<h1>Reset Password</h1></br><p>Click on below link to reset password</p></br><a href='https://google.com'>Link</a>";

    const template: EmailTemplate = {
        to: email,
        subject: "URL Shortener - Reset password",
        body,
        idempotencyKey: `reset-password:${userId}`
    }

    return template;
}