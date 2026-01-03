import { EmailTemplateEnum } from "../jobs/email.job";

/**
 * Function to create email body
 * @param template Template for body creation
 * @param email Email address
 * @param data Optional data
 */
export const createEmailBody = (template: EmailTemplateEnum, email: string, data?: any) => {
    let body: string = "";
    switch(template) {
        case EmailTemplateEnum.VerifyEmail :
            body = createVerifyEmailBody(email);
            break;
        case EmailTemplateEnum.ResetPassowrd :
            body = createResetPasswordBody(email);
            break;
        default:
            body = "<h1>Welcome to URL Shortener</h1>";
            break;
    }

    return body;
}

// TODO: Generate links
/**
 * Helper function to create email body for email verification
 * @param email Email address
 */
const createVerifyEmailBody = (email: string): string => {
    return "<h1>Verify Email</h1></br><p>Click on below link to verify</p></br><a href='https://google.com'>Link</a>"
}

/**
 * Helper function to create email body for password reset
 * @param email Email address
 */
const createResetPasswordBody = (email: string) => {
    return "<h1>Reset Password</h1></br><p>Click on below link to reset password</p></br><a href='https://google.com'>Link</a>"
}