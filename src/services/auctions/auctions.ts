import {FastifyInstance, FastifyPluginCallback} from "fastify";

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
		const product = await getProductById(auction.productId);
		if (!product) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Cannot find this product"),
			);
		}
		return res.status(200).send({...auction, product: product});
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
		return res.status(200).send({...auction, product: product});
	});

	fastify.get("/", { schema: getAllAuctionsSchema }, async (req: any, res: any) => {
		const perPage = parseInt(req.query.perPage) || 10;
		const page = parseInt(req.query.page) || 1;
		const totalPages = await getPagesCount(perPage);
		const auctions = await getAuctionByPage(perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		for (let i = 0; i < auctions.length; i++) {
			auctions[i] = {
				...auctions[i],
				product: await getProductById(auctions[i].productId),
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
