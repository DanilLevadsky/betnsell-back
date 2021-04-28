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
	getUserSchema,
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
import jwt from "jsonwebtoken";
import {
	deleteProductsByUser,
	getProductPagesCount,
	getProductsByUser,
} from "../products/queries";
import {
	getAuctionsByUser,
	getPagesCountByUser,
} from "../auctions/queries";


const users: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.get("/:id", { schema: getUserSchema }, async (req: any, res: any ) => {
		const user = await getUserById(parseInt(req.params.id));
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User with such id not found"),
			);
		}
		return res.status(200).send(user);
	});

	fastify.patch("/update/username", {schema: updateUsernameSchema}, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const user = await getUserById(data.id);
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

	fastify.patch("/update/email", {schema: updateEmailSchema}, async (req: any, res: any) => {
	 const token = req.headers.authorization.split(" ")[1];
	 const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
	 if (!data) {
		 return res.status(401).send(
			 new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
		 );
	 }
	 const user = await getUserById(data.id);
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


	fastify.patch("/update/password", {schema: updatePasswordSchema}, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const user = await getUserById(data.id);
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

	fastify.patch("/update/name", {schema: updateNameSchema}, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const user = await getUserById(data.id);
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

	fastify.patch("/update/mobile", {schema: updateMobileSchema}, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const user = await getUserById(data.id);
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

	fastify.patch("/update/profilePic", {schema: updateProfilePicSchema}, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const user = await getUserById(data.id);
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

	fastify.patch("/update/balance", {schema: updateBalanceSchema}, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const user = await getUserById(data.id);
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

	fastify.get("/:userId/products", {}, async (req:any, res:any) => {
		const perPage = req.query.perPage;
		const page = req.query.page;

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
			userId: user.id,
			products: products,
			totalPages: totalPages,
			currentPage: page,
		});
	});

	fastify.get("/:userId/auctions", {}, async (req:any, res:any)=> {
		const perPage = req.query.perPage;
		const page = req.query.page;

		const user = await getUserById(parseInt(req.params.userId));
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const totalPages = await getPagesCountByUser(perPage, user.id);
		const auctions = await getAuctionsByUser(user.id, perPage, page);
		if (!auctions) {
			new RequestError(400, ErrorTypes.auctionNotFoundError, "Auctions not found");
		}
		return res.status(200).send({auctions: auctions, totalPages: totalPages, currentPage: page});
	});

	fastify.delete("/delete", async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data: any = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const id = data.id;
		await deleteProductsByUser(id);
		const deletedUser = await deleteUser(parseInt(data.id));
		if (!deletedUser) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "Cannot delete user"),
			);
		}
		return res.status(204).send();
	});

};
// TODO: разобраться с кодами я везде ебанул 400 или 200 надо глянуть где надо поменять
export { users };
// TODO: общий юзер огромная модель
