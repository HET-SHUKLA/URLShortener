import { email, z } from 'zod';
import { AuthProvider } from '../../generated/prisma/enums';

const userInputSchema = z.object({
    email: z.email(),
    password: z.string().min(8).optional(),
});

type UserInput = z.infer<typeof userInputSchema>;

export {
    userInputSchema,
}

export type {
    UserInput
}