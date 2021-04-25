import {FastifyInstance, FastifyPluginCallback} from "fastify";

import {
	createAuction,
	getAuctionById, getAuctionByPage,
	getAuctionByProductId,
	getAuctionsByUser, getPagesCount,
} from "./queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import {queryStringSchema} from "./schema";
// Todo: create schemas and import it.

const auctions: FastifyPluginCallback = async function (
	fastify: FastifyInstance,
) {
	fastify.put("/create", {}, async (req: any, res: any) => {
		const auction = await createAuction(req.body.data);
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidAuctionDataError, "Cannot create auction"),
			);
		}
		return res.status(201).send(auction);
	});

	fastify.get("/id/:id", {}, async (req: any, res: any) => {
		const auction = await getAuctionById(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction not found"),
			);
		}
		return res.status(200).send(auction);
	});

	fastify.get("/user/:id", {}, async (req: any, res: any) => {
		const auction = await getAuctionsByUser(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction not found"),
			);
		}
		return res.status(200).send(auction);
	});

	fastify.get("/product/:id", {}, async (req: any, res: any) => {
		const auction = await getAuctionByProductId(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction not found"),
			);
		}
		return res.status(200).send(auction);
	});

	fastify.get("/pages/:perPage", async (req:any, res:any) => {
		const pages = getPagesCount(parseInt(req.params.perPage));
		return res.status(200).send({pages: pages});
	});


	fastify.get("/pages", { schema: queryStringSchema }, async (req: any, res: any) => {
		const perPage = parseInt(req.query.perPage);
		const page = parseInt(req.query.page);
		const auctions = await getAuctionByPage(perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		return res.status(200).send({auctions});
	});
};

export { auctions };
