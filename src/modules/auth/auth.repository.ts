import { REFRESH_TOKEN_EXPIRES_AT } from '../../constants';
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

// export const findUserAuthByEmail = async (email: string) => {
//     return await prisma.userAuth.findUnique({
//         where: {
//             email,
//         },
//     });
// };

export const createUserForEmail = async (param: EmailAuthInput, hashedRefreshToken: string, sessionParam: SessionParam): Promise<string> => {

    // Transaction to store user in User, UserAuth, Session
    try {
        return await prisma.$transaction(async (tx) => {
            // User
            const user = await tx.user.create({
                data: {
                    email: param.email,
                }
            });

            // UserAuth
            await tx.userAuth.create({
                data: {
                    userId: user.id,
                    email: param.email,
                    authProvider: AuthProvider.EMAIL,
                    password: param.password,
                }
            });

            // Session
            await tx.session.create({
                data: {
                    userId: user.id,
                    tokenHash: hashedRefreshToken,
                    expiresAt: REFRESH_TOKEN_EXPIRES_AT
                }
            });

            return user.id;
        });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            throw new ConflictError("User with email is already exists, Please login");
        }

        throw e;
    }
}