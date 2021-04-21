import { deleteUser, getUserById, updateUser } from "./queries";
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { deleteUserSchema, getUserSchema, updateUserSchema } from "./schema";
import { RequestError } from "../../utils/error";
import { ErrorTypes } from "../../constants/errorConstants";
import jwt from "jsonwebtoken";


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

	fastify.patch("/update/:id", { schema: updateUserSchema }, async (req: any, res: any) => {
		const updatedUser = await updateUser(parseInt(req.params.id), req.body.data);
		if (!updatedUser) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.invalidUpdateInfoError, "Cannot update info"),
			);
		}
		return res.status(200).send(updatedUser);
	});

	fastify.delete("/delete", { schema: deleteUserSchema }, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.unauthorizedError, "Unauthorized"),
			);
		}
		const deletedUser = await deleteUser(parseInt((data as any).id));
		if (!deletedUser) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "Cannot delete user"),
			);
		}
		return res.status(204).send();
	});
};

export { users };
