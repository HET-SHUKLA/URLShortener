import { prisma } from '../../db/prisma';
import { verifyPassword } from '../../lib/password';
import { NotFoundError } from '../../lib/error';

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

export const authUserEmail = async (email: string, password: string): Promise<boolean> => {
    const user = await prisma.userAuth.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new NotFoundError(`User with email id: ${email}, does not exists!`);
    }

    if (!user.password) {
        return false;
    }

    return verifyPassword(password, user.password);
};
