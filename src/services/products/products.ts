import {
	FastifyInstance,
	FastifyPluginCallback,
} from "fastify";
import {createProduct, getProductById, getProductByUser} from "./queries";
import { postProductSchema} from "./schema";

const products: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.put("/", { schema: postProductSchema }, async (req: any, res: any) => {
		const product = await createProduct(req.body.data);
		if (!product) {
			return res.status(400).send({ message: res.error.message });
		}
		return res.status(201).send(product);
	});

	fastify.get("/id/:id", {}, async (req: any, res: any) => {
		const product = await getProductById(parseInt(req.params.id));
		if (!product) {
			return res.status(400).send({
				statusCode: res.status,
				message: "Product not found",
				date: Date.now(),
			});
		}
		return res.status(200).send(product);
	});

	fastify.get("/user/:id", {}, async (req: any, res: any) => {
		const products = await getProductByUser(parseInt(req.params.id));
		if (!products) {
			return res.status(400).send({
				statusCode: res.status,
				message: "Products not found",
				date: Date.now(),
			});
		}
		return res.status(200).send(products);
	});
};

export { products };
