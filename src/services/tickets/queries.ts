import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const createTickets = async function(count: number, auctionId: number) {
	for (let i = 0; i < count; i ++) {
		await prisma.ticket.create({
			data: {
				auctionId: auctionId,
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
	const count = await tickets.count();
	const forUpdate = Math.floor(Math.random() * count);
	return await tickets[forUpdate].update({
		data: {
			isWinning: true,
		},
	});
};

export {
	createTickets,
	generateWinnerTicket,
};
