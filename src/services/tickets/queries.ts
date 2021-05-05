import {PrismaClient} from "@prisma/client";

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

export {
	createTickets,
	generateWinnerTicket,
};
