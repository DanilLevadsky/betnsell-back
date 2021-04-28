import {FastifyInstance, FastifyPluginCallback} from "fastify";
import {
	createProduct,
	getProductById,
	updateProduct,
	deleteProduct,
} from "./queries";
import {postProductSchema} from "./schema";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import jwt from "jsonwebtoken";

const products: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.put("/create", { schema: postProductSchema }, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		if (data.id !== req.body.userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "Invalid product owner error"),
			);
		}
		// TODO: схема - полный объект
		const product = await createProduct(req.body);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidProductDataError, "Cannot create product with such data"),
			);
		}
		return res.status(201).send(product);
	});

	// TODO: create schema
	fastify.get("/:id", {}, async (req: any, res: any) => {
		const product = await getProductById(parseInt(req.params.id));
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "There are no products with such id"),
			);
		}
		return res.status(200).send(product);
	});

	// TODO: create schema(4)
	// TODO: update отдельные эндпоинты для каждого атрибута бд
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
		if (product!.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		const updatedProduct = await updateProduct(parseInt(req.params.id), req.body);
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