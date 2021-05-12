import { PrismaClient } from "@prisma/client";
import {createTickets, generateWinnerTicket} from "../tickets/queries";
import {getProductById} from "../products/queries";

const prisma = new PrismaClient();

const createAuction = async function (data: any) {
	const Auction = await prisma.auction.create({
		data: {
			...data,
			totalPrice: data.totalTickets * data.pricePerTicket,
		},
	});
	await prisma.auction.update({
		data: {
			lotExpireDate: new Date(Auction.createdAt.setDate(Auction.createdAt.getDate() + 14)),
		},
		where: {
			id: Auction.id,
		},
	});
	await createTickets(Auction.totalTickets, Auction.id);
	await generateWinnerTicket(Auction.id);
	return getAuctionById(Auction.id);
};

const getAuctionById = async function (id: number) {
	return await prisma.auction.findUnique({
		where: {
			id: id,
		},
	});
};

const getAuctionByProductId = async function (productId: number) {
	return await prisma.auction.findUnique({
		where: {
			productId: productId,
		},
	});
};

const getPagesCount = async function(perPage: number) {
	const length = await prisma.auction.count();
	const pages = length / perPage;
	if (Math.floor(pages) === pages) {
		return pages;
	} else {
		return Math.floor(pages) + 1;
	}
};

const getPagesCountByUser = async function(perPage: number, userId: number) {
	const length = await prisma.auction.count({
		where: {
			product: {
				userId: userId,
			},
		},
	});
	const pages = length / perPage;
	if (Math.floor(pages) === pages) {
		return pages;
	} else {
		return Math.floor(pages) + 1;
	}
};

const getAuctionByPage = async function (perPage: number, page: number) {
	return await prisma.auction.findMany({
		orderBy: {
			id: "asc",
		},
		skip: perPage*(page-1),
		take: perPage,
	});
};

const getAllUsersAuctions = async function(userId: number) {
	const auctions = await prisma.auction.findMany({
		where: {
			product: {
				userId: userId,
			},
		},
	});
	for (let i = 0; i < auctions.length; i++) {
		auctions[i] = {...auctions[i], product: await getProductById(auctions[i].productId)};
	}
	return auctions;
};

const getAuctionsByUser = async function (userId: number, perPage: number, page: number) {
	return await prisma.auction.findMany({
		take: perPage,
		skip: perPage*(page-1),
		where: {
			product: {
				userId: userId,
			},
		},
		orderBy: {
			status: "asc",
		},
	});
};

export {
	createAuction,
	getAuctionById,
	getAuctionByProductId,
	getAuctionsByUser,
	getPagesCount,
	getAuctionByPage,
	getPagesCountByUser,
	getAllUsersAuctions,
};
