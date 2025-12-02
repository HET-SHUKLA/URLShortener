import { AuthProvider } from "../../generated/prisma/enums";

/**
 * Auth DTO for Database
 */
interface UserAuthDTO {
    id: string,
    userId: string,
    email: string,
    authProvider: AuthProvider,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    lastSignInAt: Date,
    meta: Object,
}

/**
 * User created response
 */
interface UserCreatedResponse {
    id: string,
    accessToken: string,
    refreshToken: string // Only when requested through mobile
}

export type {
    UserAuthDTO,
    UserCreatedResponse,
}