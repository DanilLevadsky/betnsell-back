import {FastifyInstance, FastifyPluginCallback} from "fastify";
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

const auctions: FastifyPluginCallback = async function (
	fastify: FastifyInstance,
) {
	fastify.put("/create", { schema: postAuctionSchema, preValidation: isAuth }, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const product = await getProductById(req.body.productId);
		if (product!.userId !== userId) {
			return res.status(403).send(
				new RequestError(403, ErrorTypes.forbiddenAccessError, "You cannot update this product"),
			);
		}
		let auction: any = await createAuction(req.body);
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidAuctionDataError, "Cannot create auction"),
			);
		}
		auction = {
			...auction,
			product: await getProductById(auction.productId),
			tickets: await getTickets(auction.id),
		};
		return res.status(201).send(auction);
	});

	fastify.get("/:id", { schema: getAuctionSchema }, async (req: any, res: any) => {
		const auction = await getAuctionById(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction not found"),
			);
		}
		const product = await getProductById(auction.productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Cannot find this product"),
			);
		}
		const tickets = await getTickets(auction.id);
		return res.status(200).send({...auction, product: product, tickets: tickets});
	});


	fastify.get("/product/:id", { schema: getAuctionSchema }, async (req: any, res: any) => {
		const auction = await getAuctionByProductId(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionSubscriptionError, "Auction not created yet"),
			);
		}
		const product = await getProductById(parseInt(req.params.id));
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Cannot find this product"),
			);
		}
		const tickets = await getTickets(auction.id);
		return res.status(200).send({...auction, product: product, tickets: tickets});
	});

	fastify.get("/", { schema: getAllAuctionsSchema }, async (req: any, res: any) => {
		const perPage = parseInt(req.query.perPage) || defaultPerPage;
		const page = parseInt(req.query.page) || defaultPage;
		const totalPages = await getPagesCount(perPage);
		const auctions: any = await getAuctionByPage(perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		for (let i = 0; i < auctions.length; i++) {
			auctions[i] = {
				...auctions[i],
				products: await getProductById(auctions[i].productId),
				tickets: await getTickets(auctions[i].id),
			};
		}
		return res.status(200).send({
			pageSize: perPage,
			currentPage: page,
			totalPages: totalPages,
			content: auctions,
		});
	}); 
};

export { auctions };
