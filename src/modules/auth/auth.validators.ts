import { z } from "zod";
import { AuthProvider } from "../../generated/prisma/enums";

const authSchema = z.object({
    email: z.email(),
    authProvide: z.enum(AuthProvider),
    // Optional if auth provider is other than email
    password: z.string().min(8).optional(),
});

const emailAuthInputSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

type EmailAuthInput = z.infer<typeof emailAuthInputSchema>;
type Auth = z.infer<typeof authSchema>;

export {
    authSchema,
    emailAuthInputSchema,
}

export type {
    EmailAuthInput,
    Auth,
}