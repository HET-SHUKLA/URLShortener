import { Queue } from "bullmq";
import { EMAIL_SEND_JOB, EMAIL_SEND_QUEUE } from "../../constants";
import { EmailTemplate } from "./template";
import IORedis from 'ioredis';
import { config } from "../../config/env.config";

export const connection = new IORedis({
    host: config.REDIS_HOST,
    maxRetriesPerRequest: null 
});
const emailSendingQueue = new Queue(EMAIL_SEND_QUEUE, { connection });

/**
 * Helper function to create Email sending job and send it to the queue
 * @param job EmailTemplate
 */
export const createEmailSendingJob = async (job: EmailTemplate) => {
    await emailSendingQueue.add(
        EMAIL_SEND_JOB,
        job,
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            jobId: job.idempotencyKey
        }
    )
}
