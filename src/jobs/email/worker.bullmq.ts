import { Job, Worker } from "bullmq";
import { EMAIL_SEND_QUEUE } from "../../constants";
import { sendEmailUsingSES } from "./sender.ses";
import { connection } from "./queue.bullmq";

export const emailSendingWorker = new Worker(EMAIL_SEND_QUEUE, async (job: Job) => {
    await sendEmailUsingSES(job.data);
}, {connection});

emailSendingWorker.on("ready", () => {
    console.log("");
});