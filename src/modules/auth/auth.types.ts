import { AuthProvider } from "../../generated/prisma/enums";

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