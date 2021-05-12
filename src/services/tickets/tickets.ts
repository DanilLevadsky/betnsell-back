import {FastifyInstance, FastifyPluginCallback} from "fastify";
import isAuth from "../../hooks/isAuth";
import {purchaseTicket} from "./queries";
import {getAuctionById} from "../auctions/queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";

const tickets: FastifyPluginCallback = async function (fastify: FastifyInstance) {

	fastify.post("/", {preValidation: isAuth}, async (req: any, res:any) => {
		const auctionId = parseInt(req.body.auctionId);
		const ticketNumbers = req.body.ticketNumbers;
		const userId = req.requestContext.get("userId").id;
		const auction = await getAuctionById(auctionId);
		if (!auction) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auction no found"),
			);
		}
		const purchased = [];
		for (const number of ticketNumbers) {
			try {
				const ticket = await purchaseTicket(auctionId, number, userId);
				if (ticket instanceof RequestError) {
					throw new Error;
				}
				purchased.push(ticket);
			} catch (e) {
				return res.status(400).send(
					new RequestError(400, ErrorTypes.auctionSubscriptionError, "cannot purchase ticket"));
			}
		}
		return res.status(200).send({tickets: purchased});
	});
};
export {tickets};
