import { prisma } from '../../db/prisma';
import { Prisma } from '../../generated/prisma/client';
import { AuthProvider } from '../../generated/prisma/enums';
import { ConflictError } from '../../lib/error';
import { UserAuthDTO } from './auth.types';
import { EmailAuthInput } from './auth.validators';

// Not in v1.0.0
// export const createAuthUser = async (params: {
//     // user_auth table
//     userId: UUID, // FK of users table
//     email: string,
//     password?: string,
//     authProvider: AuthProvider,
//     lastSignInAt: Date,
//     meta?: Object,

//     // Users table
//     isEmailVerified?: boolean,
//     emailVerifiedAt?: Date,
// }) => {
//     const {
//         userId,
//         email,
//         password,
//         authProvider,
//         lastSignInAt = (Date.now()).toString(),
//         meta = Object({}),
        
//         // Users table
//         isEmailVerified,
//         emailVerifiedAt,
//     } = params;

//     const auth = await prisma.userAuth.create({
//         data: {
//             user: {
//                 create: {
//                     email,
//                     isEmailVerified,
//                     emailVerifiedAt,
//                 }
//             },
//             email,
//             password,
//             authProvider,
//             lastSignInAt,
//             meta,
//         }
//     });

//     return auth;
// };

export const findUserAuthByEmail = async (email: string) => {
    return await prisma.userAuth.findUnique({
        where: {
            email,
        },
    });
};

export const createUserForEmail = async (param: EmailAuthInput, refreshToken: string) => {

    // TODO: transaction to store user in User, UserAuth, Session
    try {
        const userId = "123";
        return userId;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            throw new ConflictError("User with email is already exists, Please login");
        }

        throw e;
    }
}