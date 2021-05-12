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
import {FastifyInstance, FastifyPluginCallback} from "fastify";
import {
	generalUserSchema, getUserAuctionsSchema, getUserProductsSchema,
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
	deleteProductsByUser, getAllUsersProducts, getProductById,
	getProductPagesCount,
	getProductsByUser,
} from "../products/queries";
import {
	getAllUsersAuctions,
	getAuctionsByUser,
	getPagesCountByUser,
} from "../auctions/queries";
import isAuth from "../../hooks/isAuth";
import {getTickets} from "../tickets/queries";


const users: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.get("/:id", { schema: shortUserSchema }, async (req: any, res: any ) => {
		const user = await getUserById(parseInt(req.params.id));
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User with such id not found"),
			);
		}
		return res.status(200).send(user);
	});

	fastify.get("/", {schema: generalUserSchema, preValidation: isAuth}, async (req:any, res:any) => {
		const userId = req.requestContext.get("userId").id;
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const products = await getAllUsersProducts(user.id);
		if (!products) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Products not found"),
			);
		}
		const auctions = await getAllUsersAuctions(user.id);
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

	fastify.patch("/update/username", {schema: updateUsernameSchema, preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated = await updateUsername(user.id, req.body.username);
		if (!updated) {
			res.staus(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/email", {schema: updateEmailSchema, preValidation: isAuth}, async (req: any, res: any) => {
	 const userId = req.requestContext.get("userId").id;
	 const user = await getUserById(userId);
	 if (!user) {
		 return res.status(400).send(
			 new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
		 );
	 }
	 const updated = await updateEmail(user.id, req.body.email);
	 if (!updated) {
		 res.staus(400).send(
			 new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
		 );
	 }
	 return res.status(200).send(updated);
 	});


	fastify.patch("/update/password", {schema: updatePasswordSchema, preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated = await updatePassword(user.id, req.body.password);
		if (!updated) {
			res.staus(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/name", {schema: updateNameSchema, preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated = await updateName(user.id, req.body.name);
		if (!updated) {
			res.staus(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/mobile", {schema: updateMobileSchema, preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated = await updateMobile(user.id, req.body.mobile);
		if (!updated) {
			res.staus(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/profilePic", {schema: updateProfilePicSchema, preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated = await updateProfilePic(user.id, req.body.profilePic);
		if (!updated) {
			res.staus(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.patch("/update/balance", {schema: updateBalanceSchema, preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const updated = await addFunds(user.id, req.body.sum);
		if (!updated) {
			res.staus(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update user with this data"),
			);
		}
		return res.status(200).send(updated);
	});

	fastify.get("/:userId/products", {schema: getUserProductsSchema}, async (req:any, res:any) => {
		const perPage = parseInt(req.query.perPage) || 10;
		const page = parseInt(req.query.page) || 1;

		const user = await getUserById(parseInt(req.params.userId));
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const totalPages = await getProductPagesCount(perPage, user.id);
		const products = await getProductsByUser(user.id, perPage, page);
		if (!products) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.productNotFoundError, "Products not found"),
			);
		}
		return res.status(200).send({
			pageSize: perPage,
			products: products,
			totalPages: totalPages,
			content: page,
		});
	});

	fastify.get("/:userId/auctions", {schema: getUserAuctionsSchema}, async (req:any, res:any)=> {
		const perPage = parseInt(req.query.perPage) || 10;
		const page = parseInt(req.query.page) || 1;
		const userId = parseInt(req.params.userId);
		const user = await getUserById(userId);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const totalPages = await getPagesCountByUser(perPage, userId);
		const auctions = await getAuctionsByUser(userId, perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		for (let i = 0; i < auctions.length; i++) {
			auctions[i] = {
				...auctions[i],
				product: await getProductById(auctions[i].productId),
				tickets: await getTickets(auctions[i].id),
			};
		}
		return res.status(200).send({
			pageSize: perPage,
			currentPage: page,
			totalPages: totalPages,
			content: auctions,
		});
	});

	fastify.delete("/delete", {preValidation: isAuth}, async (req: any, res: any) => {
		const userId = req.requestContext.get("userId").id;
		await deleteProductsByUser(userId);
		const deletedUser = await deleteUser(userId);
		if (!deletedUser) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "Cannot delete user"),
			);
		}
		return res.status(204).send();
	});

};

export { users };
