import {FastifyInstance, FastifyPluginCallback} from "fastify";
import {
	createProduct,
	getAllProducts,
	getProductById,
	getProductByUser,
	updateProduct,
	deleteProduct,
} from "./queries";
import {postProductSchema} from "./schema";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import jwt from "jsonwebtoken";

const products: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.put("/", { schema: postProductSchema }, async (req: any, res: any) => {
		const product = await createProduct(req.body.data);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidProductDataError, "cannot create product with such data"),
			);
		}
		return res.status(201).send(product);
	});

	// TODO: create schema
	fastify.get("/id/:id", {}, async (req: any, res: any) => {
		const product = await getProductById(parseInt(req.params.id));
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "There are no products with such id"),
			);
		}
		return res.status(200).send(product);
	});

	// TODO: create schema(2)
	fastify.get("/user/:id", {}, async (req: any, res: any) => {
		const products = await getProductByUser(parseInt(req.params.id));
		if (!products) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "There are no products from user with such id"),
			);
		}
		return res.status(200).send(products);
	});

	// TODO: create schema(3)
	fastify.get("/all", {}, async (req: any, res: any) => {
		const products = await getAllProducts();
		if (!products) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "There are no products"),
			);
		}
		return res.status(200).send(products);
	});

	// TODO: create schema(4)
	fastify.patch("/update/:id", {}, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const user: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!user) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const userId = user.id;
		const product = await getProductById(parseInt(req.params.id));
		if (product.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		const updatedProduct = await updateProduct(parseInt(req.params.id), req.body.data);
		if (!updatedProduct) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.delete("/delete/:id", async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const user: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!user) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const product = await getProductById(parseInt(req.params.id));
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Product not found"),
			);
		}
		if (product.userId !== user.id) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot delete this product"),
			);
		}
		const deletedProduct = await deleteProduct(parseInt(req.params.id));
		if (!deletedProduct) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Product not found"),
			);
		}
		return res.status(204).send({});
	});
};

export { products };
