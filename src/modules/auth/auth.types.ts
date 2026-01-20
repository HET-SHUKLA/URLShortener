import { AuthProvider } from "../../generated/prisma/enums";

/**
 * User DTO
 */
export interface UserDTO {
    id: string;
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
    providerId: string | null,
    password: string | null,
    createdAt: Date,
    updatedAt: Date,
    lastSignInAt: Date,
    meta: Object | null,
}

/**
 * User created response
 */
export interface UserCreatedResponse {
    id: string,
    accessToken: string,
    refreshToken: string // Only when requested through mobile
}

export interface UserMeDBResponse extends UserDTO {
    user_auth: {
        email: string
    }[]
}