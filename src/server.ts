import fastify from "fastify";
import fastifyJWT from "fastify-jwt";
import crypto from "crypto";

const server = fastify({ logger: true });
server.register(fastifyJWT, {
	secret: crypto.randomBytes(32).toString("base64"),
});

export { server };
