import { PrismaClient } from "@prisma/client";

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

const getProductByUser = async function(userId: number) {
	return await prisma.product.findMany({
		where: {
			userId: userId,
		},
	});
};

const getAllProducts = async function() {
	return await prisma.product.findMany({});
};

const updateProduct = async function(id: number, data: any) {
	const product = await getProductById(id);
	let updatedProduct;
	if (product) {
		updatedProduct = await prisma.product.update({
			where: {
				id: product.id,
			},
			data: {
				...data,
			},
		}).catch((err: any) => {
			return { message: err.message };
		});
	}
	return updatedProduct;
};

const deleteProduct = async function(id: number) {
	const product = await getProductById(id);
	if (product) {
		return await prisma.product.delete({
			where: {
				id: product.id,
			},
		});
	}
	return null;
};

const deleteProductsByUser = async function(userId: number) {
	return await prisma.product.deleteMany({
		where: {
			userId: userId,
		},
	});
};

export {
	createProduct,
	getProductById,
	getProductByUser,
	getAllProducts,
	updateProduct,
	deleteProduct,
	deleteProductsByUser,
};
