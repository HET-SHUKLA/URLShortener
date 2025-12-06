// All the constant

import { config } from "./config/env.config";

// Token Expiry
export const REFRESH_TOKEN_TTL_MS =
  config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_TTL_SECONDS =  REFRESH_TOKEN_TTL_MS / 1000;


export const REFRESH_TOKEN_EXPIRES_AT = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

// Logging Events
export const HTTP_RESPONSE_SUCCESS = "http_response_success";
export const HTTP_RESPONSE_BAD_REQUEST = "http_response_bad_request";
export const UNHANDLED_ERROR = "unhandled_error";

export const AUTH_REGISTER_REQUEST = "auth_register_request";
export const AUTH_USER_CREATING = "auth_user_creating"
export const AUTH_USER_CREATED = "auth_user_created"
export const AUTH_REGISTER_RATE_LIMITED = 
"auth_register_rate_limited";

export const FAILURE_APP_ERROR = "failure_app_error";
