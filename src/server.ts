import fastify from "fastify";
import { auth } from "./services/auth/auth";
import { users } from "./services/users/users";
import { products } from "./services/products/products";
import { auctions } from "./services/auctions/auctions";
import fastifyCors from "fastify-cors";
import {fastifyRequestContextPlugin} from "fastify-request-context";

const server = fastify({ logger: true });

server.register(fastifyRequestContextPlugin, {hook: "preValidation"});
server.register(fastifyCors, { origin: true });
server.register(auth, { prefix: "/auth" });
server.register(users, { prefix: "/users" });
server.register(products, { prefix: "/products" });
server.register(auctions, { prefix: "/auctions" });

export { server };
