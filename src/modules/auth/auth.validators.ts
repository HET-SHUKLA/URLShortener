import { z } from "zod";
import { AuthProvider } from "../../generated/prisma/enums";

export const authSchema = z.object({
    email: z.email(),
    authProvider: z.enum(AuthProvider),
    // Optional if auth provider is other than email
    password: z.string().min(8).optional(),
});

export const emailAuthInputSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});


export type EmailAuthInput = z.infer<typeof emailAuthInputSchema>;

export type Auth = z.infer<typeof authSchema>;