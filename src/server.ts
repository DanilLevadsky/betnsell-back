import fastify from "fastify";
import { auth } from "./services/auth/auth";
import { users } from "./services/users/users";

const server = fastify({ logger: true });

server.register(auth, { prefix: "/auth" });
server.register(users, { prefix: "/users" });

export { server };
