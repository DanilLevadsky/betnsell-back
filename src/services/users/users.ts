import {
	addFunds,
	deleteUser,
	getUserById,
	updateEmail,
	updateMobile,
	updateName,
	updatePassword,
	updateProfilePic,
	updateUsername,
} from "./queries";
import {FastifyInstance, FastifyPluginCallback, FastifyReply} from "fastify";
import {
	generalUserSchema,
	getUserAuctionsSchema,
	getUserProductsSchema,
	shortUserSchema,
	updateBalanceSchema,
	updateEmailSchema,
	updateMobileSchema,
	updateNameSchema,
	updatePasswordSchema,
	updateProfilePicSchema,
	updateUsernameSchema,
} from "./schema";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import {
	getAllUsersProducts,
	getProductById,
	getProductPagesCount,
	getProductsByUser,
} from "../products/queries";
import {
	getAllUsersAuctions, getAuctionByProductId,
	getAuctionsByUser,
	getPagesCountByUser,
} from "../auctions/queries";
import isAuth from "../../hooks/isAuth";
import {getTickets} from "../tickets/queries";
import {User, Product, Auction} from ".prisma/client";

const users: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.get("/:id", { schema: shortUserSchema }, async (req: any, res: FastifyReply ) => {
		const user: User | null = await getUserById(parseInt(req.params.id));
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User with such id not found"),
			);
		}
		return res.status(200).send(user);
	});

	fastify.get("/", {schema: generalUserSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const products: Array<Product> = await getAllUsersProducts(user.id);
		if (!products) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Products not found"),
			);
		}
		const auctions: Array<Auction> = await getAllUsersAuctions(user.id);
		if (!auctions) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found"),
			);
		}
		return res.status(200).send({
			id: user.id,
			username: user.username,
			balance: user.balance,
			userInfo: {
				email: user.email,
				mobile: user.mobile,
				name: user.name,
			},
			products: products,
			auctions: auctions,
		});
	});

	fastify.patch("/update/username", {schema: updateUsernameSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated: User | null = await updateUsername(user.id, req.body.username);
		if (!updated) {
			res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/email", {schema: updateEmailSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
	 const userId: number = req.requestContext.get("userId").id;
	 const user: User | null = await getUserById(userId);
	 if (!user) {
		 return res.status(400).send(
			 new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
		 );
	 }
	 const updated = await updateEmail(user.id, req.body.email);
	 if (!updated) {
		 res.status(400).send(
			 new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
		 );
	 }
	 return res.status(200).send(updated);
 	});


	fastify.patch("/update/password", {schema: updatePasswordSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated: User | null = await updatePassword(user.id, req.body.password);
		if (!updated) {
			res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/name", {schema: updateNameSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated: User | null = await updateName(user.id, req.body.name);
		if (!updated) {
			res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/mobile", {schema: updateMobileSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated: User | null = await updateMobile(user.id, req.body.mobile);
		if (!updated) {
			res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/profilePic", {schema: updateProfilePicSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated: User | null = await updateProfilePic(user.id, req.body.profilePic);
		if (!updated) {
			res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/balance", {schema: updateBalanceSchema, preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated: User | null = await addFunds(user.id, req.body.sum);
		if (!updated) {
			res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.get("/:userId/products", {schema: getUserProductsSchema}, async (req: any, res: FastifyReply) => {
		const perPage: number = parseInt(req.query.perPage) || 10;
		const page: number = parseInt(req.query.page) || 1;
		const userId: number = parseInt(req.params.userId);
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const totalPages: number = await getProductPagesCount(perPage, userId);
		const products: Array<Product> = await getProductsByUser(userId, perPage, page);
		const data = [];
		for (const product of products) {
			data.push({
				...product,
				auction: await getAuctionByProductId(product.id),
			});
		}
		if (!products) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Products not found"),
			);
		}
		return res.status(200).send({
			pageSize: perPage,
			products: products,
			totalPages: totalPages,
			content: data,
		});
	});

	fastify.get("/:userId/auctions", {schema: getUserAuctionsSchema}, async (req: any, res: FastifyReply)=> {
		const perPage: number = parseInt(req.query.perPage) || 10;
		const page: number = parseInt(req.query.page) || 1;
		const userId: number = parseInt(req.params.userId);
		const user: User | null = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const totalPages: number = await getPagesCountByUser(perPage, userId);
		const auctions: Array<Auction> = await getAuctionsByUser(userId, perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		const data: Array<any> = [];
		for (let i = 0; i < auctions.length; i++) {
			data.push({
				...auctions[i],
				product: await getProductById(auctions[i].productId),
				tickets: await getTickets(auctions[i].id),
			});
		}
		return res.status(200).send({
			pageSize: perPage,
			currentPage: page,
			totalPages: totalPages,
			content: data,
		});
	});

	fastify.delete("/delete", {preValidation: isAuth}, async (req: any, res: FastifyReply) => {
		const userId: number = req.requestContext.get("userId").id;
		const deletedUser: User | null = await deleteUser(userId);
		if (!deletedUser) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "Cannot delete user"),
			);
		}
		return res.status(204).send();
	});

};

export {users};
