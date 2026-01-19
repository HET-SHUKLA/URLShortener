import { FastifyReply, FastifyRequest } from "fastify";
import { emailAuthInputSchema } from "./auth.validators";
import { createUserUsingEmailService, getUserFromAccessTokenService, loginUserUsingEmailPassword, updateRefreshTokenService, userLogoutService, userLogoutSessionService, verifyEmailAddressService } from "./auth.service";
import { badRequest, created, ok } from "../../lib/response";
import { getHeaderString } from "../../util/header";
import { config } from "../../config/env.config";
import { logInfo } from "../../lib/logger";
import {
  AUTH_REGISTER_REQUEST,
  AUTH_USER_CREATED,
  AUTH_USER_CREATING,
  EMAIL,
  MOBILE,
  PASSWORD,
  REFRESH_TOKEN_TTL_SECONDS,
  WEB,
} from "../../constants";
import { AuthError, InternalServerError, NotFoundError } from "../../lib/error";

function getRefreshToken(request: FastifyRequest): string | null {
  if (request.cookies?.refreshToken) {
    return request.cookies.refreshToken
  }

  const auth = request.headers.authorization
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7)
  }

  return null
}


/**
 * Returns User's information based on access token
 * @param req FastifyRequest
 * @param reply FastifyResponse
 * @returns API response
 */
export const handleMeAuth = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const authorization = req.headers["authorization"];

  // Remove "Bearer"
  const token = authorization?.split(" ")[1];

  if (!token) {
    return badRequest(reply, "Token is invalid");
  }

  const userData = await getUserFromAccessTokenService(token);

  const responseData = {
    id: userData.id,
    email: userData.email,
    isEmailVerified: userData.isEmailVerified
  }

  return ok(reply, "User details fetched successfully", responseData);
};

/**
 * Handle user registration using Email and Password
 * @param req FastifyRequest
 * @param reply FastifyResponse
 * @returns API response
 */
export const handleUserRegister = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const clientRaw = req.headers["x-client-type"];
  const userAgent = req.headers["user-agent"] ?? null;
  const ipAddress = req.ip;

  logInfo(
    reply.log,
    AUTH_REGISTER_REQUEST,
    "User registration request receieved",
    {
      route: reply.request?.routeOptions.url,
      userAgent,
      ipAddress,
    },
  );

  const clientType = getHeaderString(clientRaw)?.trim().toLowerCase();

  if (!clientType) {
    return badRequest(reply, "X-Client-Type header is missing!");
  }

  if (![MOBILE, WEB].includes(clientType)) {
    return badRequest(reply, "X-Client-Type header is invalid!");
  }

  const body = emailAuthInputSchema.parse(req.body);

  const isMobile = clientType === "mobile";

  logInfo(reply.log, AUTH_USER_CREATING, "User creation has been started");

  const res = await createUserUsingEmailService(body, userAgent, ipAddress);

  if (isMobile) {
    logInfo(
      reply.log,
      AUTH_USER_CREATED,
      "User successfully created in mobile",
      {
        userId: res.id,
        ip: ipAddress,
        userAgent,
      },
    );

    return created(reply, "User created successfully", res);
  }

  const refreshToken = res.refreshToken;
  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production" || config.NODE_ENV === "staging",
    sameSite: "lax",
    path: "/api/v1/auth",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  logInfo(
    reply.log,
    AUTH_USER_CREATED,
    "User successfully created, Refresh token Cookie set",
    {
      userId: res.id,
      ip: ipAddress,
      userAgent,
    },
  );

  return created(reply, "User created successfully", {
    id: res.id,
    accessToken: res.accessToken,
  });
};

/**
 * Handle Link Verification
 * @param req FastifyRequest
 * @param reply FastifyReply
 * @returns API response
 */
export const handleVerification = async (
  req: FastifyRequest<{Params: {item: string, token: string}}>,
  reply: FastifyReply
) => {
  const { item, token } = req.params;

  if (![EMAIL, PASSWORD].includes(item) || !token) {
    throw new NotFoundError("URL does not exists!");
  }

  const isVerified = await verifyEmailAddressService(token);
  if (isVerified) {
    return ok(reply, "Email address verified");
  }

  throw new AuthError("Token is either expired or does not exists");
}

export const handleGoogleAuth = () => {};

export const handleRefreshToken = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const clientRaw = req.headers["x-client-type"];
  const token = getRefreshToken(req);

  const clientType = getHeaderString(clientRaw)?.trim().toLowerCase();

  if (!token) {
    return badRequest(reply, "Token is required!");
  }

  if (!clientType) {
    return badRequest(reply, "X-Client-Type header is missing!");
  }

  if (![MOBILE, WEB].includes(clientType)) {
    return badRequest(reply, "X-Client-Type header is invalid!");
  }

  const isMobile = clientType === "mobile";

  const res = await updateRefreshTokenService(token);

  if (isMobile) {
    return ok(reply, "Token has been refreshed!", res);
  }

  const refreshToken = res.refreshToken;
  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production" || config.NODE_ENV === "staging",
    sameSite: "lax",
    path: "/api/v1/auth", // TODO: Needs to fix this, Maybe use req.route
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  return ok(reply, "Token has been refreshed!", {
    id: res.id,
    accessToken: res.accessToken,
  });
};

// TODO: Merge login and register method
export const handleUserLogin = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const clientRaw = req.headers["x-client-type"];
  const userAgent = req.headers["user-agent"] ?? null;
  const ipAddress = req.ip;

  logInfo(
    reply.log,
    AUTH_REGISTER_REQUEST,
    "User login request receieved",
    {
      route: reply.request?.routeOptions.url,
      userAgent,
      ipAddress,
    },
  );

  const clientType = getHeaderString(clientRaw)?.trim().toLowerCase();

  if (!clientType) {
    return badRequest(reply, "X-Client-Type header is missing!");
  }

  if (![MOBILE, WEB].includes(clientType)) {
    return badRequest(reply, "X-Client-Type header is invalid!");
  }

  const body = emailAuthInputSchema.parse(req.body);

  const isMobile = clientType === "mobile";

  logInfo(reply.log, AUTH_USER_CREATING, "User logging in has been started");

  const res = await loginUserUsingEmailPassword(body, userAgent, ipAddress);

  if (isMobile) {
    logInfo(
      reply.log,
      AUTH_USER_CREATED,
      "User successfully logged in through mobile",
      {
        userId: res.id,
        ip: ipAddress,
        userAgent,
      },
    );

    return ok(reply, "User logged in successfully", res);
  }

  const refreshToken = res.refreshToken;
  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production" || config.NODE_ENV === "staging",
    sameSite: "lax",
    path: "/api/v1/auth", // TODO: Needs to fix this, Maybe use req.route
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  });

  logInfo(
    reply.log,
    AUTH_USER_CREATED,
    "User successfully logged in, Refresh token Cookie set",
    {
      userId: res.id,
      ip: ipAddress,
      userAgent,
    },
  );

  return ok(reply, "User logged in successfully", {
    id: res.id,
    accessToken: res.accessToken,
  });
};

export const handleUserLogout = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const refreshToken = getRefreshToken(req);
  let allSessions = false;

  if (!refreshToken) {
    return badRequest(reply, "Token is required to log out user");
  }

  if (req.routeOptions.url?.includes("all")) {
    allSessions = true;
  }

  const isUserLoggedOut = await userLogoutService(allSessions, refreshToken);

  if (isUserLoggedOut) {
    return ok(reply, "User logged out successfully");
  }

  throw new InternalServerError("Something went wrong, Try again after some time");
};

export const handleSessionLogout = async (
  req: FastifyRequest<{Params: {sessionId: string}}>,
  reply: FastifyReply
) => {
  const { sessionId } = req.params;

  const isUserLoggedOut = await userLogoutSessionService(sessionId);

  if (isUserLoggedOut) {
    return ok(reply, "User logged out successfully");
  }

  throw new InternalServerError("Something went wrong, Try again after some time");
};
