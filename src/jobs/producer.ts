import { Queue } from "bullmq";
import { EmailTemplate } from "../util/emailBody";
import { EMAIL_SEND_QUEUE } from "../constants";

const emailSendingQueue = new Queue(EMAIL_SEND_QUEUE);

export const createEmailSendingJob = (template: EmailTemplate) => {
    emailSendingQueue.add(template.to, template);
}