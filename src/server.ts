import fastify from "fastify";
import { routes } from "./services/auth/auth";

const server = fastify({ logger: true });

server.register(routes, { prefix: "/auth" });

export { server };
