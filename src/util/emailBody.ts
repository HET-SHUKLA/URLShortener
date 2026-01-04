export enum EmailTemplateEnum {
    VerifyEmail = "VERIFY_EMAIL",
    ResetPassowrd = "RESET_PASSWORD"
}

export interface EmailTemplate {
    to: string,
    subject: string,
    body: string,
}

/**
 * Function to create email body
 * @param template Template for body creation
 * @param email Email address
 * @param data Optional data
 */
export const createEmailTemplate = (template: EmailTemplateEnum, email: string, data?: any) => {
    let body: EmailTemplate;
    switch(template) {
        case EmailTemplateEnum.VerifyEmail :
            body = createVerifyEmailBody(email);
            break;
        case EmailTemplateEnum.ResetPassowrd :
            body = createResetPasswordBody(email);
            break;
        default:
            body = {
                to: email, 
                subject: "Welcome to URL Shortener", 
                body: "<h1>Welcome to URL Shortener</h1>"
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
const createVerifyEmailBody = (email: string): EmailTemplate => {
    const body = "<h1>Verify Email</h1></br><p>Click on below link to verify</p></br><a href='https://google.com'>Link</a>";

    const template: EmailTemplate = {
        to: email,
        subject: "URL Shortener - Email verification",
        body
    }

    return template;
}

/**
 * Helper function to create email body for password reset
 * @param email Email address
 */
const createResetPasswordBody = (email: string): EmailTemplate => {
    const body = "<h1>Reset Password</h1></br><p>Click on below link to reset password</p></br><a href='https://google.com'>Link</a>";

    const template: EmailTemplate = {
        to: email,
        subject: "URL Shortener - Reset password",
        body
    }

    return template;
}