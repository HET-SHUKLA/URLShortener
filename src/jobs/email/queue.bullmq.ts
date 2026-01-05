import { Job, Queue, Worker } from "bullmq";
import { EMAIL_SEND_QUEUE } from "../../constants";
import { EmailTemplate } from "./template";
import { sendEmailUsingSES } from "./sender.ses";
import IORedis from 'ioredis';

const connection = new IORedis({
    host: 'redis',
    maxRetriesPerRequest: null 
});
const emailSendingQueue = new Queue(EMAIL_SEND_QUEUE, { connection });

export const createEmailSendingJob = async (job: EmailTemplate) => {
    await emailSendingQueue.add(
        job.to,
        job,
        {
            attempts: 3,
            removeOnComplete: true,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            jobId: job.idempotencyKey
        }
    )
}

new Worker(EMAIL_SEND_QUEUE, async (job: Job) => {
    await sendEmailUsingSES(job.data);
}, { connection });
