import { UUID } from 'node:crypto';
import { prisma } from '../../db/prisma';
import { AuthProvider } from '../../generated/prisma/enums';

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

export const authenticateUser = async (email: string, password: string) => {
    
};



// mport { PrismaClient, ProtectionMethod } from "@prisma/client";

// const prisma = new PrismaClient(); // or inject a shared instance

// export class UrlRepository {
//   static async createUrl(params: {
//     shortId: string;
//     longUrl: string;
//     ownerId?: string | null;
//     protectionMethod: ProtectionMethod;
//     protectedPasswordHash?: string | null;
//     expiresAt: Date;
//   }) {
//     const {
//       shortId,
//       longUrl,
//       ownerId = null,
//       protectionMethod,
//       protectedPasswordHash = null,
//       expiresAt,
//     } = params;

//     const url = await prisma.url.create({
//       data: {
//         shortId,
//         longUrl,
//         ownerId,
//         protectionMethod,
//         protectedPassword: protectedPasswordHash,
//         expiresAt,
//       },
//     });

//     return url;
//   }

//   static async findByShortId(shortId: string) {
//     return prisma.url.findUnique({
//       where: { shortId },
//     });
//   }

//   static async incrementTotalClicks(id: bigint, success: boolean) {
//     return prisma.url.update({
//       where: { id },
//       data: success
//         ? { totalClicks: { increment: 1 }, totalSuccessClicks: { increment: 1 } }
//         : { totalClicks: { increment: 1 } },
//     });
//   }
// }