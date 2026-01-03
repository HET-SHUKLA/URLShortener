export enum EmailTemplateEnum {
    VerifyEmail = "VERIFY_EMAIL",
    ResetPassowrd = "RESET_PASSWORD"
}

export interface EmailTemplate {
    to: string,
    template: EmailTemplateEnum,
    body: any
}