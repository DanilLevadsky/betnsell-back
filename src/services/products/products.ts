import {FastifyInstance, FastifyPluginCallback} from "fastify";
import isAuth from "../../hooks/isAuth";
import {
	createProduct,
	getProductById,
	updateTitle,
	updateDescription,
	updatePhoto,
	deleteProduct,
} from "./queries";
import {	
	postProductSchema,
	getProductSchema,
	updateDescriptionSchema,
	updateTitleSchema,
	updatePhotoSchema,
} from "./schema";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import jwt from "jsonwebtoken";

const products: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.put("/create", { schema: postProductSchema, preValidation: isAuth }, async (req: any, res: any) => {
		const productInfo = {...req.body, userId: req.requestContext.get("userId").id};
		const product = await createProduct(productInfo);
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

	fastify.patch("/:id/title", { schema: updateTitleSchema, preValidation: isAuth }, async(req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const productId = parseInt(req.params.id);
		const product = await getProductById(productId);
		if (product!.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		const updatedProduct = await updateTitle(productId, req.body.title);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.patch("/:id/description", { schema: updateDescriptionSchema, preValidation: isAuth }, async(req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const productId = parseInt(req.params.id);
		const product = await getProductById(productId);
		if (product!.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		const updatedProduct = await updateDescription(productId, req.body.description);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.patch("/:id/photo", { schema: updatePhotoSchema, preValidation: isAuth }, async(req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const productId = parseInt(req.params.id);
		const product = await getProductById(productId);
		if (product!.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		const updatedProduct = await updatePhoto(productId, req.body.photo);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.delete("/:id", {preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const productId = parseInt(req.params.id);
		const product = await getProductById(productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Product not found"),
			);
		}
		if (product.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot delete this product"),
			);
		}
		const deletedProduct = await deleteProduct(productId);
		if (!deletedProduct) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Product not found"),
			);
		}
		return res.status(204).send();
	});
};

export { products };
