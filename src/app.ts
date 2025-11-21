import { fastify, type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";

export const buildApp = (): FastifyInstance => {
    
    const app = fastify({
        logger: true
    });

    // Security plugins
    app.register(helmet);

    app.get('/health', () => {
        return {status: 'ok', uptime: process.uptime()};
    });

    // 404 handler
    app.setNotFoundHandler((req, reply) => {
        return reply.status(404).send({
            success: false,
            error: {
                message: 'Route not found',
                method: req.method,
                url: req.url
            }
        });
    });

    // Global error handler
    app.setErrorHandler((error, req, reply) => {
        app.log.error(error);
        return reply.status(500).send({
            success: false,
            error: {
                message: 'Internal Server Error',
                details: (error as Error)?.message
            }
        });
    });

    return app;
}