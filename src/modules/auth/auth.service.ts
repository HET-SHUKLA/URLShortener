import { authUserEmail } from "./auth.repository"

export const authenticateUserWithEmail = async (email: string, password: string) => {
    
    await authUserEmail(email, password);
}


// ```ts
// // src/modules/urls/urls.service.ts
// import { ProtectionMethod } from "@prisma/client";
// import { UrlRepository } from "./urls.repository";
// import { generateShortId } from "../../lib/shortid";
// import { hashPassword, verifyPassword } from "../../lib/password";
// import { CreateShortUrlBody } from "./urls.validators";
// import { ResolveShortUrlResult, ShortUrlDTO } from "./urls.types";

// export class UrlService {
//   static async createShortUrl(
//     body: CreateShortUrlBody,
//     ownerId?: string | null
//   ): Promise<ShortUrlDTO> {
//     const protectionMethod = body.protectionMethod ?? ProtectionMethod.NONE;

//     let protectedPasswordHash: string | null = null;

//     if (protectionMethod === ProtectionMethod.PASSWORD) {
//       if (!body.password) {
//         throw new Error("Password required for PASSWORD protection");
//       }
//       protectedPasswordHash = await hashPassword(body.password);
//     }

//     // Decide expiry logic: example
//     const now = new Date();
//     const expiresAt =
//       body.expiresAt != null ? new Date(body.expiresAt) : this.getDefaultExpiry(ownerId != null);

//     const shortId = generateShortId(8);

//     const url = await UrlRepository.createUrl({
//       shortId,
//       longUrl: body.longUrl,
//       ownerId: ownerId ?? null,
//       protectionMethod,
//       protectedPasswordHash,
//       expiresAt,
//     });

//     return {
//       id: url.id,
//       shortId: url.shortId,
//       longUrl: url.longUrl,
//       ownerId: url.ownerId,
//       expiresAt: url.expiresAt,
//       createdAt: url.createdAt,
//     };
//   }

//   static getDefaultExpiry(isAuthenticated: boolean): Date {
//     const now = new Date();
//     if (!isAuthenticated) {
//       // guest: 5 days
//       now.setDate(now.getDate() + 5);
//     } else {
//       // user: 6 months
//       now.setMonth(now.getMonth() + 6);
//     }
//     return now;
//   }

//   static async resolveShortId(
//     shortId: string,
//     providedPassword?: string
//   ): Promise<ResolveShortUrlResult> {
//     const url = await UrlRepository.findByShortId(shortId);

//     if (!url || url.deletedAt || url.expiresAt < new Date()) {
//       throw new Error("URL not found or expired");
//     }

//     // check protection
//     if (url.protectionMethod === "PASSWORD") {
//       if (!providedPassword || !url.protectedPassword) {
//         throw new Error("Password required");
//       }
//       const ok = await verifyPassword(providedPassword, url.protectedPassword);
//       if (!ok) {
//         throw new Error("Invalid password");
//       }
//       // mark success click
//       await UrlRepository.incrementTotalClicks(url.id, true);
//     } else {
//       // not password-protected (OTP/APPROVE logic can be added later)
//       await UrlRepository.incrementTotalClicks(url.id, true);
//     }

//     return {
//       longUrl: url.longUrl,
//       isProtected: url.protectionMethod !== "NONE",
//       protectionMethod: url.protectionMethod,
//     };
//   }
// }
// ```
