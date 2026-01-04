import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import { config } from "../config/env.config";

const ses = new SESv2Client({
  region: config.AWS_SES_REGION,
});

const command = new SendEmailCommand({
    FromEmailAddress: "noreply@yourdomain.com",
    Destination: {
      ToAddresses: ["user@example.com"],
    },
    Content: {
      Simple: {
        Subject: {
          Data: "Welcome",
        },
        Body: {
          Text: {
            Data: "Welcome to our platform.",
          },
        },
      },
    },
})