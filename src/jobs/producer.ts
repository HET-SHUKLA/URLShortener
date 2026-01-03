import { Queue } from "bullmq";
import { EmailTemplate } from "../util/emailBody";

const emailSendingQueue = new Queue("email-send");

export const createEmailSendingJob = (template: EmailTemplate) => {
    emailSendingQueue.add(template.to, template);
}