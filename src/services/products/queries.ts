import { PrismaClient } from "@prisma/client";
import { deleteAuctionsByUser } from "../auctions/queries";

const prisma = new PrismaClient();

const createProduct = async function(data: any): Promise<any> {
	return await prisma.product.create({
		data: { ...data },
	}).catch((err: any) => {
		return err.message;
	});
};

const getProductById = async function(id: number) {
	return await prisma.product.findUnique({
		where: {
			id: id,
		},
	});
};

const getProductsByUser = async function(userId: number, perPage: number, page: number) {
	return await prisma.product.findMany({
		take: perPage,
		skip: perPage*(page-1),
		where: {
			userId: userId,
		},
	});
};

const getProductPagesCount = async function(perPage: number, userId: number) {
	const length = await prisma.product.count({
		where: {
			userId: userId,
		},
	});
	const pages = length / perPage;
	if (Math.floor(pages) === pages) {
		return pages;
	} else {
		return Math.floor(pages) + 1;
	}
};


const updateTitle = async function(id: number, title: string) {
	return await prisma.product.update({
		data: {
			title: title,
		},
		where: {
			id: id,
		},
	});
};

const updateDescription = async function(id: number, description: string) {
	return await prisma.product.update({
		data: {
			description: description,
		},
		where: {
			id: id,
		},
	});
};

const updatePhoto = async function(id: number, photo: any) {
	return await prisma.product.update({
		data: {
			photo: photo,
		},
		where: {
			id: id,
		},
	});
};

const deleteProductById = async function(id: number) {
	const product = await getProductById(id);
	if (product) {
		if (!product.isBusy) {
			return await prisma.product.delete({
				where: {
					id: product.id,
				},
			});
		}
	}
	return null;
};

const deleteProductsByUser = async function(userId: number) {
	const deletedAuction = await deleteAuctionsByUser(userId);
	return await prisma.product.deleteMany({
		where: {
			userId: userId,
		},
	});
};

const getAllUsersProducts = async function(userId: number) {
	return await prisma.product.findMany({
		where: {
			userId: userId,
		},
	});
};

export {
	createProduct,
	getProductById,
	getProductsByUser,
	updateTitle,
	updateDescription,
	updatePhoto,
	deleteProductById,
	deleteProductsByUser,
	getProductPagesCount,
	getAllUsersProducts,
};
