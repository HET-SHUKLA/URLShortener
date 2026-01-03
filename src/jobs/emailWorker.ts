import { Job, Worker } from "bullmq";
import { EMAIL_SEND_QUEUE } from "../constants";

const emailWorker = new Worker(EMAIL_SEND_QUEUE, async (job: Job) => {
    
})