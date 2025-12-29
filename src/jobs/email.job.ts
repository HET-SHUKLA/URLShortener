export enum EmailTemplateEnum {
    VerifyTemplate = "VERIFY_TEMPLATE",
    ResetPassowrd = "RESET_PASSWORD"
}

export interface EmailTemplate {
    to: string,
    template: EmailTemplateEnum,
    idempotencyKey: string
}