import { z } from "zod";
import { AuthProvider } from "../../generated/prisma/enums";

export const authSchema = z.object({
    email: z.email(),
    authProvide: z.enum(AuthProvider),
    // Optional if auth provider is other than email
    password: z.string().min(8).optional(),
    lastSignInAt: z.iso.datetime(),
});

export const emailAuthInputSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});