import {FastifyReply} from "fastify";
import jwt from "jsonwebtoken";
import {RequestError} from "../utils/error";
import {ErrorTypes} from "../constants/errorConstants";

export default async function isAuth(req: any, res: FastifyReply) {
	const token = req.headers.authorization.split(" ")[1];
	try {
		const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
		req.requestContext.set("userId", { id: payload.id});
		return;
	} catch (err) {
		return res.status(401).send(
			new RequestError(401, ErrorTypes.unauthorizedError, "User is not authorized"),
		);
	}
}
