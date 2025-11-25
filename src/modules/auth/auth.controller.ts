import { FastifyReply, FastifyRequest } from "fastify";

export const handleUserAuthWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    const body = 
}


// ```ts
// // src/modules/urls/urls.controller.ts
// import { FastifyRequest, FastifyReply } from "fastify";
// import { createShortUrlSchema } from "./urls.validators";
// import { UrlService } from "./urls.service";

// export class UrlController {
//   static async createShortUrlHandler(req: FastifyRequest, reply: FastifyReply) {
//     // 1. Validate body (throws on invalid)
//     const body = createShortUrlSchema.parse(req.body);

//     // You will later get ownerId from auth, for now assume anonymous:
//     const ownerId = (req as any).userId ?? null;

//     const result = await UrlService.createShortUrl(body, ownerId);

//     return reply.status(201).send({
//       id: result.id,
//       shortId: result.shortId,
//       longUrl: result.longUrl,
//       expiresAt: result.expiresAt,
//     });
//   }

//   static async redirectHandler(req: FastifyRequest, reply: FastifyReply) {
//     const { shortId } = req.params as { shortId: string };
//     const { password } = (req.query as any) ?? {};

//     const result = await UrlService.resolveShortId(shortId, password);

//     // For now: simply respond with JSON; later you’ll use reply.redirect(result.longUrl)
//     return reply.status(200).send({
//       longUrl: result.longUrl,
//       isProtected: result.isProtected,
//       protectionMethod: result.protectionMethod,
//     });
//   }
// }
// ```
