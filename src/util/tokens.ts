import jwt from 'jsonwebtoken';
import { config } from '../config/env.config';
import { randomBytes, createHash } from 'crypto';
import { EMPTY_STRING } from '../constants';

/**
 * Helper function to fetch user id from Access token
 * @param token Access Token
 * @returns Either userId or null
 */
export const getUserIdFromAccessToken = (token: string): string | null => {
    try {
        const payload = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;

        return payload.sub ?? null;
    } catch (e) {
        return null;
    }
};

/**
 * Helper function to create access token
 * @param userId User Id, sent in access token
 * @returns Signed access token
 */
export const generateAccessToken = (userId: string): string => {
    return jwt.sign(
        {
            sub: userId,
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRES_IN,
            algorithm: "HS256"
        }
    )
}

/**
 * Helper function to create raw tokens
 * @returns Raw refresh token
 */
export const generateRefreshToken = (): string => {
    const buf = randomBytes(64);
    return buf.toString('base64')
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Helper function to Hash raw tokens
 * @param token Raw token
 * @returns Hashed token
 */
export const hashToken = (token: string): string => {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Helper function to generate verification token
 * @returns Verification Token
 */
export const generateVerificationToken = (): string => {
    return randomBytes(32).toString("hex");
}
