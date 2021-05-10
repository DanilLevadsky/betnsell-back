import {PrismaClient} from "@prisma/client";
import {getAuctionById} from "../auctions/queries";
import {getUserById} from "../users/queries";
import { RequestError } from "../../utils/error";
import { ErrorTypes } from "../../constants/errorConstants";

const prisma = new PrismaClient();

const createTickets = async function(count: number, auctionId: number) {
	for (let i = 0; i < count; i ++) {
		await prisma.ticket.create({
			data: {
				auctionId: auctionId,
				ticketNumber: (i + 1),
			},
		});
	}
};

const generateWinnerTicket = async function(auctionId: number) {
	const tickets = await prisma.ticket.findMany({
		where: {
			auctionId: auctionId,
		},
	});
	const count = tickets.length;
	const forUpdate = Math.floor(Math.random() * count) + 1;
	return await prisma.ticket.updateMany({
		data: {
			isWinning: true,
		},
		where: {
			ticketNumber: forUpdate,
			auctionId: auctionId,
		},
	});
};

const purchaseTicket = async function(
	auctionId: number,
	ticketNumber: number,
	pricePerTicket: number,
	userId: number,
) {
	let ticket = await prisma.ticket.findFirst({
		where: {
			auctionId: auctionId,
			ticketNumber: ticketNumber,
		},
	});
	const auction = await getAuctionById(auctionId);
	const user: any = await getUserById(userId);
	if (ticket && user.id !== auction.userId) {
		if (ticket.userId) {
			return new RequestError(400, ErrorTypes.auctionSubscriptionError, "Ticket already taken");
		}
		if (user.balance > auction.pricePerTicket) {
			await prisma.user.update({
				data: {
					balance: user.balance - auction.pricePerTicket,
				}, where: {
					id: userId,
				},
			});
			ticket = await prisma.ticket.update({
				data: {
					userId: userId,
				},
				where: {
					id: ticket.id,
				},
			});
			return ticket;
		}
	}
	return new RequestError(400, ErrorTypes.auctionSubscriptionError, "cannot purchase ticket");
};

export {
	createTickets,
	generateWinnerTicket,
	purchaseTicket,
};
