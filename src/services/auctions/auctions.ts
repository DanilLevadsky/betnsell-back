import {FastifyInstance, FastifyPluginCallback} from "fastify";

import {
	createAuction,
	getAuctionById, getAuctionByPage,
	getAuctionByProductId,
	getPagesCount,
} from "./queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import {
	postAuctionSchema, 
	getAuctionSchema, 
	queryStringSchema,
} from "./schema";

const auctions: FastifyPluginCallback = async function (
	fastify: FastifyInstance,
) {
	fastify.put("/create", { schema: postAuctionSchema }, async (req: any, res: any) => {
		const auction = await createAuction(req.body);
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidAuctionDataError, "Cannot create auction"),
			);
		}
		return res.status(201).send(auction);
	});

	fastify.get("/:id", { schema: getAuctionSchema }, async (req: any, res: any) => {
		const auction = await getAuctionById(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction not found"),
			);
		}
		return res.status(200).send(auction);
	});


	fastify.get("/product/:id", { schema: getAuctionSchema }, async (req: any, res: any) => {
		const auction = await getAuctionByProductId(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionSubscriptionError, "Auction not created yet"),
			);
		}
		return res.status(200).send(auction);
	});

	fastify.get("/", { schema: queryStringSchema }, async (req: any, res: any) => {
		const perPage = parseInt(req.query.perPage) || 10;
		const page = parseInt(req.query.page) || 1;
		const totalPages = await getPagesCount(perPage);
		const auctions = await getAuctionByPage(perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		return res.status(200).send({auctions: auctions, totalPages: totalPages, currentPage: page});
	}); 
};

export { auctions };
