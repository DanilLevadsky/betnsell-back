import { PrismaClient } from "@prisma/client";

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

const getPagesCount = async function(perPage: number) {
	const length = await prisma.auction.count();
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
	// }
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
	getPagesCount,
	getAuctionByPage,
};
