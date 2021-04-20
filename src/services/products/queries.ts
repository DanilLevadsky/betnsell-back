import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createProduct = async function(data: any): Promise<any> {
	const product = await prisma.product.create({
		data: {
			title: data.title,
			price: data.price,
			description: data.description,
			photo: data.photo,
			auction: data.auction,
			owner: data.owner,
		},
	});
	return product;
};
