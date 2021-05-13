import {Auction, PrismaClient, Ticket} from "@prisma/client";
import {getAuctionById} from "../auctions/queries";
import {addFunds, getUserById} from "../users/queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";

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
	userId: number,
) {
	let ticket: any = await prisma.ticket.findFirst({
		where: {
			auctionId: auctionId,
			ticketNumber: ticketNumber,
		},
	});
	const auction: any = await getAuctionById(auctionId);
	const user: any = await getUserById(userId);
	if (userId === auction.userId) {
		return new RequestError(400, ErrorTypes.auctionSubscriptionError, "You cannot subscribe on your own auction");
	}
	if (auction.status !== "STARTED") {
		return new RequestError(400, ErrorTypes.auctionSubscriptionError, "Auction already finished");
	}
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
		await updateAuction(auctionId);
		return ticket;
	}
	return new RequestError(400, ErrorTypes.auctionSubscriptionError, "cannot purchase ticket");
};

const getTickets = async function(auctionId: number) {
	return await prisma.ticket.findMany({
		where: {
			auctionId: auctionId,
		},
		orderBy: {
			ticketNumber: "asc",
		},
	});
};

const updateAuction = async function(auctionId: number) {
	const free = await prisma.ticket.count({
		where: {
			auctionId: auctionId,
			userId: null,
		},
	});
	if (free == 0) {
		const winner: any = await prisma.ticket.findFirst({
			where: {
				auctionId: auctionId,
				isWinning: true,
			},
		});
		await prisma.auction.update({
			where: {
				id: auctionId,
			},
			data: {
				winnerId: winner.userId,
				status: "FINISHED",
			},
		});
	}
};

const deleteTicketsByAuctionId = async function(auctionId: number) {
	const tickets: any = await prisma.ticket.findMany({
		where: {
			auctionId: auctionId,
		},
	});
	const auction: any = await prisma.auction.findUnique({
		where: {
			id: auctionId,
		},
	});
	for (const ticket of tickets) {
		await addFunds(ticket.userId, auction.pricePerTicket);
	}
	return await prisma.ticket.deleteMany({
		where: {
			auctionId: auctionId,
		},
	});
};

export {
	createTickets,
	generateWinnerTicket,
	purchaseTicket,
	getTickets,
	deleteTicketsByAuctionId,
};
