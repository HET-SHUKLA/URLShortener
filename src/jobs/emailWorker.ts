import { Job, Worker } from "bullmq";
import { EMAIL_SEND_QUEUE } from "../constants";
import axios from "axios";

const emailWorker = new Worker(EMAIL_SEND_QUEUE, async (job: Job) => {
    axios.post("", {
        "Action": "SendEmail",
        "Source": "temp-email",
        "Destination.ToAddresses.member.1": job.data.to,
        "Message.Subject.Data": job.data.subject,
        "Message.Body.Html.Data": job.data.body,
    });
})