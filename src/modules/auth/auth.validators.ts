import { z } from "zod";
import { AuthProvider } from "../../generated/prisma/enums";

export const authSchema = z.object({
    email: z.email(),
    authProvide: z.enum(AuthProvider),
    // Optional if auth provider is other than email
    password: z.string().min(8).optional(),
    lastSignInAt: z.iso.datetime(),
});

export type AuthSchema = z.infer<typeof authSchema>;




// import { z } from "zod";
// import { ProtectionMethod } from "@prisma/client"; // enum from Prisma

// export const createShortUrlSchema = z.object({
//   longUrl: z.string().url("Invalid URL"),
//   protectionMethod: z.nativeEnum(ProtectionMethod).optional(),
//   password: z.string().min(6).optional(), // only used if method=PASSWORD
//   expiresAt: z.string().datetime().optional(), // ISO string; convert later
// });

// // Helper type from Zod schema:
// export type CreateShortUrlBody = z.infer<typeof createShortUrlSchema>;