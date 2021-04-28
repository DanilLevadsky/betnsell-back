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
}

const updatePrice = async function(id: number, price: number) {
	return await prisma.product.update({
		data: {
			price: price,
		},
		where: {
			id: id,
		},
	});
}

const updateDescription = async function(id: number, description: string) {
	return await prisma.product.update({
		data: {
			description: description,
		},
		where: {
			id: id,
		},
	});
}

const updatePhoto = async function(id: number, photo: string) {
	return await prisma.product.update({
		data: {
			photo: photo,
		},
		where: {
			id: id,
		},
	});
}

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
	updatePrice,
	deleteProduct,
	deleteProductsByUser,
	getProductPagesCount,
	getAllUsersProducts,
};
