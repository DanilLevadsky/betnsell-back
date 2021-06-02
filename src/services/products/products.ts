import {
	FastifyInstance,
	FastifyPluginCallback,
	FastifyReply,
} from "fastify";
import isAuth from "../../hooks/isAuth";
import {
	createProduct,
	getProductById,
	updateTitle,
	updateDescription,
	updatePhoto,
	deleteProductById,
} from "./queries";
import {
	generalProductSchema,
	postProductSchema,
	updateDescriptionSchema,
	updateTitleSchema,
	updatePhotoSchema,
} from "./schema";
import {getAuctionByProductId} from "../auctions/queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import {Product, Auction} from ".prisma/client";

const products: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.put("/create", {schema: postProductSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const productInfo: object = {...req.body, userId: req.requestContext.get("userId").id};
		const product: Product | null = await createProduct(productInfo);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidProductDataError, "Cannot create product with such data"),
			);
		}
		return res.status(201).send(product);
	});

	fastify.get("/:id", { schema: generalProductSchema }, async (req: any, res: FastifyReply) => {
		const product: Product | null = await getProductById(parseInt(req.params.id));
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "There are no products with such id"),
			);
		}
		const auction: Auction | null = await getAuctionByProductId(product.id);
		return res.status(200).send({
			id: product.id,
			title: product.title,
			description: product.description,
			photo: product.photo,
			userId: product.userId,
			auction: auction,
		});
	});

	fastify.patch("/:id/title", { schema: updateTitleSchema, preValidation: isAuth }, async(req: any, res: any) => {
		const userId: number = req.requestContext.get("userId").id;
		const productId: number = parseInt(req.params.id);
		const product: Product | null = await getProductById(productId);
		const auction: Auction | null = await getAuctionByProductId(productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Product not found"),
			);
		}
		if (product.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		if (auction) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		const updatedProduct: Product | null = await updateTitle(productId, req.body.title);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.patch("/:id/description", { schema: updateDescriptionSchema, preValidation: isAuth }, async(req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const productId: number = parseInt(req.params.id);
		const product: Product | null = await getProductById(productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Product not found"),
			);
		}
		if (product.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		const updatedProduct: Product | null = await updateDescription(productId, req.body.description);
		if (!updatedProduct) {
			return res.status(400).send(new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update product"),
			);
		}
		return res.status(200).send(updatedProduct);
	});

	fastify.patch("/:id/photo", { schema: updatePhotoSchema, preValidation: isAuth }, async(req: any, res: FastifyReply) => {
		const userId = req.requestContext.get("userId").id;
		const productId = parseInt(req.params.id);
		const product: Product | null = await getProductById(productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Product not found"),
			);
		}
		if (product.userId !== userId) {
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

	fastify.delete("/:id", {preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const productId: number = parseInt(req.params.id);
		const product: Product | null = await getProductById(productId);
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
		const deletedProduct: Product | null = await deleteProductById(productId);
		if (!deletedProduct) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot delete product"),
			);
		}
		return res.status(204).send();
	});
};

export {products};
