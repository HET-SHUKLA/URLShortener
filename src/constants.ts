// All the constant

import { config } from "./config/env.config";
import { daysToMs, daysToSeconds } from "./util/time";

// Time constants
export const SECOND = 1000;               // 1 second in ms
export const MINUTE = 60 * SECOND;        // 1 minute in ms
export const HOUR = 60 * MINUTE;          // 1 hour in ms
export const DAY = 24 * HOUR;             // 1 day in ms

// Token Expiry
export const REFRESH_TOKEN_TTL_MS = daysToMs(config.REFRESH_TOKEN_TTL_DAYS);
export const REFRESH_TOKEN_TTL_SECONDS = daysToSeconds(config.REFRESH_TOKEN_TTL_DAYS);


// Logging Events
export const HTTP_RESPONSE_SUCCESS = "http_response_success";
export const HTTP_RESPONSE_BAD_REQUEST = "http_response_bad_request";
export const UNHANDLED_ERROR = "unhandled_error";
export const TOO_MANY_REQUEST_ERROR = "too_many_requests";

export const AUTH_REGISTER_REQUEST = "auth_register_request";
export const AUTH_USER_CREATING = "auth_user_creating"
export const AUTH_USER_CREATED = "auth_user_created"
export const AUTH_REGISTER_RATE_LIMITED = 
"auth_register_rate_limited";

export const FAILURE_APP_ERROR = "failure_app_error";

// Job
export const EMAIL_SEND_QUEUE = "email_send_queue";
export const EMAIL_SEND_JOB = "email_send_job";

// Swagger tags
export const AUTH = 'Auth';
