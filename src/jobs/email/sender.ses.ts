import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { config } from "../../config/env.config";
import { EmailTemplate } from "./template";

const ses = new SESv2Client({
    region: config.AWS_SES_REGION,
});

/**
 * Helper function to create AWS SendEmailCommand object and send Email
 * @param template EmailTemplate
 */
export const sendEmailUsingSES = async (template: EmailTemplate) => {
    const command = new SendEmailCommand({
        FromEmailAddress: config.SEND_EMAIL_FROM,
        Destination: {
            ToAddresses: [template.to],
        },
        Content: {
            Simple: {
                Subject: {
                    Data: template.subject,
                },
                Body: {
                    Html: {
                        Data: template.body,
                    },
                },
            },
        },
    });

    await ses.send(command);
}