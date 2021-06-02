import {FastifyInstance, FastifyPluginCallback, FastifyReply} from "fastify";
import isAuth from "../../hooks/isAuth";
import {purchaseTicket} from "./queries";
import {getAuctionById} from "../auctions/queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import {getUserById} from "../users/queries";
import {ticketSchema} from "./schema";
import {Auction, User} from ".prisma/client";

const tickets: FastifyPluginCallback = async function (fastify: FastifyInstance) {
	fastify.post("/", {schema: ticketSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const auctionId: number = parseInt(req.body.auctionId);
		const ticketNumbers: Array<number> = req.body.ticketNumbers;
		const userId: number = req.requestContext.get("userId").id;
		const auction: Auction | null = await getAuctionById(auctionId);
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction no found"),
			);
		}
		const user: User | null = await getUserById(userId);
		if (auction.pricePerTicket * ticketNumbers.length > user!.balance) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionSubscriptionError, "Not enough money"),
			);
		}
		const purchased: Array<any> = [];
		for (const number of ticketNumbers) {
			const ticket = await purchaseTicket(auctionId, number, userId);
			if (ticket instanceof RequestError) {
				return ticket;
			}
			purchased.push(ticket);
		}
		return res.status(200).send({status: auction.status});
	});
};

export {tickets};
