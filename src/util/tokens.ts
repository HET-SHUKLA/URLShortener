import jwt from 'jsonwebtoken';
import { config } from '../config/env.config';
import { randomBytes, createHash } from 'crypto';

/**
 * Helper function to create access token
 * @param userId User Id, sent in access token
 * @returns Signed access token
 */
const generateAccessToken = (userId: string): string => {
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
const generateRefreshToken = (): string => {
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
const hashToken = (token: string): string => {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export {
    generateAccessToken,
    generateRefreshToken,
    hashToken
}