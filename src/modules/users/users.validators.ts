import { email, z } from 'zod';
import { AuthProvider } from '../../generated/prisma/enums';

const userInputSchema = z.object({
    email: z.email(),
    password: z.string().min(8).optional(),
});

const getUserSchema = z.object({
    userId: z.uuid(),
});

type UserInput = z.infer<typeof userInputSchema>;
type GetUser = z.infer<typeof getUserSchema>;

export {
    userInputSchema,
    getUserSchema,
}

export type {
    UserInput,
    GetUser,
}