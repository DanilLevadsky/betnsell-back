import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createProduct = async function(data: any): Promise<any> {
	const product = await prisma.product.create({
		data: { ...data },
	}).catch((err: any) => {
		return err.message;
	});
	return product;
};

const getProductById = async function(id: number) {
	return await prisma.product.findUnique({
		where: {
			id: id,
		},
	});
};

const getProductByUser = async function(userId: number) {
	return await prisma.product.findMany({
		where: {
			userId: userId,
		},
	});
};

export {
	createProduct,
	getProductById,
	getProductByUser,
};
