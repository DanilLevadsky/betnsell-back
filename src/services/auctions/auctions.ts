import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { parse } from "querystring";
import { products } from "../products/products";
import {
	createAuction,
	getAuctionById,
	getAuctionByProductId,
	getAuctionsByUser,
} from "./queries";
// Todo: create schemas and import it.

const auctions: FastifyPluginCallback = async function (
	fastify: FastifyInstance,
) {
	fastify.put("/", {}, async (req: any, res: any) => {
		const auction = await createAuction(req.body.data);
		if (!auction) {
			return res.status(400).send({
				statusCode: res.status,
				message: "Auction not created.",
				date: Date.now(),
			});
		}
		return res.status(201).send(auction);
	});

	fastify.get("/id/:id", {}, async (req: any, res: any) => {
		const auction = await getAuctionById(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send({
				statusCode: res.status,
				message: "Auction not found.",
				date: Date.now(),
			});
		}
		return res.status(200).send(auction);
	});
	fastify.get("/user/:id", {}, async (req: any, res: any) => {
		const auction = await getAuctionsByUser(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send({
				statusCode: res.status,
				message: "Auction not found.",
				date: Date.now(),
			});
		}
		return res.status(200).send(auction);
	});
	fastify.get("/product/:id", {}, async (req: any, res: any) => {
		const auction = await getAuctionByProductId(parseInt(req.params.id));
		if (!auction) {
			return res.status(400).send({
				statusCode: res.status,
				message: "Auction not found.",
				date: Date.now(),
			});
		}
		return res.status(200).send(auction);
	});
};

export { auctions };
