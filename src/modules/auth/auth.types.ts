import { AuthProvider } from "../../generated/prisma/enums";

/**
 * Auth DTO for Database
 */
export interface UserAuthDTO {
    id: string,
    email: string,
    authProvider: AuthProvider
    password: string,
    createdAt: Date,
    updatedAt: Date,
    lastSignInAt: Date,
    meta: Object,
}