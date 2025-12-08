import { FastifyBaseLogger } from "fastify";
import { checkRateLimit, RateLimitOptions } from "../../util/ratelimit";
import { logWarn } from "../../lib/logger";
import { TOO_MANY_REQUEST_ERROR } from "../../constants";
import { TooManyRequestsError, ValidationError } from "../../lib/error";

interface AuthRateLimitContext {
    ip?: string,
    email?: string,
    hasCaptcha?: boolean,
}

export const checkRegisterRateLimit = async (logger: FastifyBaseLogger, context: AuthRateLimitContext) => {
    const { ip, email, hasCaptcha } = context;
    if (ip) {
        const ipKey = `rt:register:ip:${ip}`;
        const rtResult = await checkRateLimit(ipKey, {limit: 10, windowSeconds: 60});

        if (!rtResult.allowed) {
            logWarn(logger, TOO_MANY_REQUEST_ERROR, "Email register, IP Rate limit reached!");

            throw new TooManyRequestsError();
        }
    }

    if (email) {
        const emailKey = `rt:register:email:${email}`;
        const rtResult = await checkRateLimit(emailKey, {limit: 5, windowSeconds: 60});

        if (!rtResult.allowed) {

            // Check captcha
            if (!hasCaptcha) {   
                throw new TooManyRequestsError("Captcha required! Or try again after few minutes");
            }

            // TODO: Verify captcha here.
            // If captcha correct, return;
            logWarn(logger, TOO_MANY_REQUEST_ERROR, "Email register, Email Rate limit reached!");

            throw new ValidationError("Captcha is incorrect!");
        }
    }
}