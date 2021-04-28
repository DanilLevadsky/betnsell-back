import {FastifyInstance, FastifyPluginCallback} from "fastify";
import {
	createProduct,
	getProductById,
	getProductsByUser,
	updateTitle,
	updateDescription,
	updatePhoto,
	updatePrice,
	deleteProduct,
	deleteProductsByUser,
	getProductPagesCount,
	getAllUsersProducts,
} from "./queries";
import {	
	postProductSchema,
	getProductSchema,
	updateDescriptionSchema,
	updateTitleSchema,
	updatePhotoSchema,
	updatePriceSchema,
} from "./schema";
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
		const product = await createProduct(req.body);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidProductDataError, "Cannot create product with such data"),
			);
		}
		return res.status(201).send(product);
	});

	fastify.get("/:id", { schema: getProductSchema }, async (req: any, res: any) => {
		const product = await getProductById(parseInt(req.params.id));
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "There are no products with such id"),
			);
		}
		return res.status(200).send(product);
	});

	fastify.patch("/update/:id/title", { schema: updateTitleSchema }, async(req: any, res: any) => {
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
		const updatedProduct = await updateTitle(parseInt(req.params.id), req.body.title);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.patch("/update/:id/description", { schema: updateDescriptionSchema }, async(req: any, res: any) => {
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
		const updatedProduct = await updateDescription(parseInt(req.params.id), req.body.description);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.patch("/update/:id/photo", { schema: updatePhotoSchema }, async(req: any, res: any) => {
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
		const updatedProduct = await updatePhoto(parseInt(req.params.id), req.body.photo);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.patch("/update/:id/price", { schema: updatePriceSchema }, async(req: any, res: any) => {
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
		const updatedProduct = await updatePrice(parseInt(req.params.id), req.body.price);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
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
