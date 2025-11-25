import { Hash, UUID } from "crypto";
import { AuthProvider } from "../../generated/prisma/enums";

/**
 * Auth DTO for Database
 */
export interface UserAuthDTO {
    id: UUID,
    email: string,
    authProvider: AuthProvider
    password: Hash,
    createdAt: Date,
    updatedAt: Date,
    lastSignInAt: Date,
    meta: Object,
}

/**
 * For User sending request for authentication
 */
export interface UserAuthInput {
    email: string,
    password: string,
}

/**
 * For auth response
 */
export interface UserAuthResponse {
    email: string,
}