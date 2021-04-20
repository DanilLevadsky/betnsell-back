import fastify from "fastify";
import { auth } from "./services/auth/auth";
import { users } from "./services/users/users";
import { products } from "./services/products/products";

const server = fastify({ logger: true });

server.register(auth, { prefix: "/auth" });
server.register(users, { prefix: "/users" });
server.register(products, { prefix: "/products" });


export { server };
