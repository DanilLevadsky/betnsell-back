import {FastifyInstance, FastifyPluginCallback, FastifyReply} from "fastify";
import {defaultPage, defaultPerPage} from "../../constants/paginationConstants";
import {
	createAuction,
	getAuctionById,
	getAuctionByPage,
	getAuctionByProductId,
	getPagesCount,
} from "./queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import {
	getAllAuctionsSchema,
	getAuctionSchema,
	postAuctionSchema,
} from "./schema";
import {getProductById} from "../products/queries";
import {getTickets} from "../tickets/queries";
import isAuth from "../../hooks/isAuth";
import { Auction, Product, Ticket } from ".prisma/client";

const auctions: FastifyPluginCallback = async function (
	fastify: FastifyInstance,
) {
	fastify.put("/create", { schema: postAuctionSchema, preValidation: isAuth }, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const product: Product | null = await getProductById(req.body.productId);
		if (product && product.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		if (product!.isBusy) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productAlreadyTakenError, "Product already in auction"),
			);
		}
		const auction: Auction | null = await createAuction(req.body);
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidAuctionDataError, "Cannot create auction"),
			);
		}
		return res.status(201).send({
			...auction,
			product: await getProductById(auction.productId),
			tickets: await getTickets(auction.id),
		});
	});

	fastify.get("/:id", { schema: getAuctionSchema }, async (req: any, res: FastifyReply) => {
		const auction: Auction | null= await getAuctionById(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction not found"),
			);
		}
		const product: Product | null = await getProductById(auction.productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Cannot find this product"),
			);
		}
		const tickets: Array<Ticket> = await getTickets(auction.id);
		return res.status(200).send({...auction, product: product, tickets: tickets});
	});


	fastify.get("/product/:id", { schema: getAuctionSchema }, async (req: any, res: FastifyReply) => {
		const productId: number = parseInt(req.params.id);
		const auction: Auction | null = await getAuctionByProductId(productId);
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionSubscriptionError, "Auction not created yet"),
			);
		}
		const product: Product | null = await getProductById(productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Cannot find this product"),
			);
		}
		const tickets: Array<Ticket> = await getTickets(auction.id);
		return res.status(200).send({...auction, product: product, tickets: tickets});
	});

	fastify.get("/", { schema: getAllAuctionsSchema }, async (req: any, res: FastifyReply) => {
		const perPage: number = parseInt(req.query.perPage) || defaultPerPage;
		const page: number = parseInt(req.query.page) || defaultPage;
		const totalPages: number = await getPagesCount(perPage);
		const auctions: Array<Auction> = await getAuctionByPage(perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		const data = {
			pageSize: perPage,
			currentPage: page,
			totalPages: totalPages,
			content: <any>[],
		};
		for (let i = 0; i < auctions.length; i++) {
			data.content.push({
				...auctions[i],
				products: await getProductById(auctions[i].productId),
				tickets: await getTickets(auctions[i].id),
			},
			);
		}
		return res.status(200).send(data);
	}); 
};

export {auctions};
