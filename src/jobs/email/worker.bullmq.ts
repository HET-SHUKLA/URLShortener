import { Job, Worker } from "bullmq";
import { EMAIL_SEND_QUEUE } from "../../constants";
import { sendEmailUsingSES } from "./sender.ses";

const emailSendingWorker = new Worker(EMAIL_SEND_QUEUE, async (job: Job) => {
    await sendEmailUsingSES(job.data);
});