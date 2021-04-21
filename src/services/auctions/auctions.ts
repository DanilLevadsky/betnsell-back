import {FastifyInstance, FastifyPluginCallback} from "fastify";

import {
	createAuction,
	getAuctionById,
	getAuctionByProductId,
	getAuctionsByUser,
} from "./queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
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
};

export { auctions };
