import fastify from "fastify";
import { auth } from "./services/auth/auth";

const server = fastify({ logger: true });

server.register(auth, { prefix: "/auth" });

export { server };
