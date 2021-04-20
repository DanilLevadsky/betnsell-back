import { getUserById, updateUser, deleteUser } from "./queries";
import {
	FastifyInstance,
	FastifyPluginCallback,
} from "fastify";
import { getUserSchema, updateUserSchema, deleteUserSchema } from "./schema";

const users: FastifyPluginCallback = async function(fastify: FastifyInstance) {
	fastify.get("/:id", { schema: getUserSchema }, async (req: any, res: any ) => {
		const user = await getUserById(parseInt(req.params.id));
		if (!user) {
			return res.status(400).send({
				statusCode: res.statusCode,
				error: res.error,
				message: "User not found",
			});
		}
		return res.status(200).send(user);
	});

	fastify.patch("/update/:id", { schema: updateUserSchema }, async (req: any, res: any) => {
		const updatedUser = await updateUser(parseInt(req.params.id), req.body.data);
		if (!updatedUser) {
			return res.status(400).send({
				statusCode: res.statusCode,
				error: res.error,
				message: "Cannot update user info",
			});
		}
		return res.status(200).send(updatedUser);
	});

	fastify.delete("/delete/:id", { schema: deleteUserSchema }, async (req: any, res: any) => {
		const deletedUser = await deleteUser(parseInt(req.params.id));
		if (!deletedUser) {
			return res.status(400).send({
				statusCode: res.statusCode,
				error: res.error,
				message: "Cannot delete user",
			});
		}
		return res.status(200).send(deletedUser);
	});
};

export { users };
