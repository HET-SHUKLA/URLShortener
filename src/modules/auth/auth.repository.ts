import { prisma } from '../../db/prisma';
import { AuthProvider } from '../../generated/prisma/enums';
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

const findUserAuthByEmail = async (email: string) => {
    return await prisma.userAuth.findUnique({
        where: {
            email,
        },
    });
};

const createUserForEmail = async (param: EmailAuthInput, refreshToken: string) => {

    // TODO: transaction to store user in User, UserAuth, Session
    const userId = "123";

    return userId;
}

export {
    findUserAuthByEmail,
    createUserForEmail
}
