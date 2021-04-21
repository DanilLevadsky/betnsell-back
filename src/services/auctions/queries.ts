import { PrismaClient } from "@prisma/client";
import { products } from "../products/products";

const prisma = new PrismaClient();

const createAuction = async function (data: any) {
	return await prisma.auction.create({
		data: {
			...data,
		},
	});
};

const getAuctionById = async function (id: number) {
	return await prisma.auction.findUnique({
		where: {
			id: id,
		},
	});
};

const getAuctionByProductId = async function (productId: number) {
	return await prisma.auction.findFirst({
		where: {
			productId: productId,
		},
	});
};

const getAuctionsByUser = async function (userId: number) {
	return await prisma.auction.findMany({
		where: {
			status: {
				in: ["STARTED", "WAITING", "FINISHED", "EXPIRED"],
			},
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
};
