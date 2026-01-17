import { config } from '../../config/env.config';
import { prisma } from '../../db/prisma';
import { Prisma } from '../../generated/prisma/client';
import { AuthProvider, VerificationTokenType } from '../../generated/prisma/enums';
import { ConflictError } from '../../lib/error';
import { expiresInDays, expiresInHrs, isDateExpired } from '../../util/time';
import { UserDTO } from './auth.types';
import { EmailAuthInput, SessionInputSchema } from './auth.validators';

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

/**
 * DB method to create user with email and password. Throws conflict error if Email is already exists
 * @param param EmailAuthInput instance
 * @param sessionParam SessionInputSchema instance
 * @returns Id of created User
 * 
 */
export const createUserWithEmail = async (param: EmailAuthInput, sessionParam: SessionInputSchema, emailVerificationToken: string): Promise<string> => {

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
                    tokenHash: sessionParam.tokenHash,
                    expiresAt: expiresInDays(config.REFRESH_TOKEN_TTL_DAYS),
                    userAgent: sessionParam.userAgent,
                    ip: sessionParam.ip
                }
            });

            // VerificationToken
            await tx.verificationToken.create({
                data: {
                    userId: user.id,
                    tokenHash: emailVerificationToken,
                    type: VerificationTokenType.EMAIL_VERIFY,
                    expiresAt: expiresInHrs(config.VERIFICATION_TOKEN_TTL_HRS)
                }
            });

            return user.id;
        });
    } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            throw new ConflictError("Email address is already exists, Kindly login");
        }

        throw e;
    }
}

/**
 * DB method to verify token. Returns either true or false.
 * @param token Token to be verified
 * @returns Boolean value
 */
export const verifyToken = async (token: string): Promise<boolean> => {
    const currentDate = new Date();
    const data = await prisma.verificationToken.findUnique({
        where: {
            tokenHash: token
        }
    });

    if (!data || data?.usedAt) {
        return false;
    }

    if (data?.expiresAt && isDateExpired(data?.expiresAt)) {
        return false;
    }

    // Token is NOT expired
    await prisma.$transaction(async (tx) => {
        // User
        await tx.user.update({
            where: {
                id: data.userId
            },
            data: {
                isEmailVerified: true,
                emailVerifiedAt: currentDate,
                updatedAt: currentDate
            }
        });

        // VerificationToken
        await tx.verificationToken.update({
            where: {
                tokenHash: token
            },
            data: {
                expiresAt: currentDate,
                usedAt: currentDate
            }
        });
    });

    return true;
}

/**
 * DB method to get User data from User ID
 * @param userId User ID
 * @returns Either UserDTO object or Null If user id does not exists
 */
export const getUserFromUserId = async (userId: string): Promise<UserDTO | null> => {
    return await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });
}

/**
 * DB method to get User data from Email address
 * @param email Email Address
 * @returns Either UserDTO object or Null If email address does not exists
 */
export const getUserFromEmail = async (email: string): Promise<UserDTO | null> => {
    return await prisma.user.findUnique({
        where: {
            email: email,
        }
    });
}
