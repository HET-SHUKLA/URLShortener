import { AuthProvider } from "../../generated/prisma/enums";

/**
 * User DTO
 */
export interface UserDTO {
    id: string;
    email: string;
    isEmailVerified: boolean;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

/**
 * Auth DTO for Database
 */
export interface UserAuthDTO {
    id: string,
    userId: string,
    email: string,
    authProvider: AuthProvider,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    lastSignInAt: Date,
    meta: Record<string, unknown>,
}

/**
 * User created response
 */
export interface UserCreatedResponse {
    id: string,
    accessToken: string,
    refreshToken: string // Only when requested through mobile
}