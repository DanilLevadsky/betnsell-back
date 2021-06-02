import * as dotenv from "dotenv";
import {loginByUsernameSchema, loginByEmailSchema, loginGetSchema, signUpPostSchema} from "./schema";
import jwt from "jsonwebtoken";
import {compareSync} from "bcryptjs";
import {FastifyInstance, FastifyPluginCallback, FastifyReply} from "fastify";
import {
	createUser,
	getUserByEmail,
	getUserByUsername,
	ifUserExists,
} from "../users/queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";
import { User } from ".prisma/client";

dotenv.config();

const auth: FastifyPluginCallback = async function(fastify: FastifyInstance): Promise<any> {
	fastify.post("/login/email", { schema: loginByEmailSchema }, async (req: any, res: FastifyReply) => {
		const user: User | null = await getUserByEmail(req.body.email);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const isCorrect: boolean = compareSync(req.body.password, user.password);
		if (!isCorrect) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.wrongPasswordOrLoginError, "Invalid login or password"),
			);
		}
		const accessToken: string = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: 21600 });
		return res.status(200).send({ jwt: accessToken, userId: user.id, expiresIn: Date.now() + 21600000});

	});

	fastify.post("/login/username", { schema: loginByUsernameSchema }, async (req: any, res: FastifyReply) => {
		const user: User | null = await getUserByUsername(req.body.username);
		if (!user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userNotFoundError, "User not found"),
			);
		}
		const isCorrect = compareSync(req.body.password, user.password);
		if (!isCorrect) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.wrongPasswordOrLoginError, "Invalid login or password"),
			);
		}
		const accessToken = jwt.sign(user, <string>process.env.ACCESS_TOKEN_SECRET, { expiresIn: 21600 });
		return res.status(200).send({ jwt: accessToken, userId: user.id, expiresIn: Date.now() + 21600000});
	});

	fastify.get("/user", { schema: loginGetSchema }, async (req: any, res: FastifyReply) => {
		const token = req.headers.authorization.split(" ")[1];
		const data = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.invalidAuthTokenError, "Token is invalid"),
			);
		}
		return res.status(200).send(data);
	});

	fastify.put("/register", { schema: signUpPostSchema }, async (req: any, res: FastifyReply) => {
		let user = await ifUserExists(req.body.email, req.body.username);
		if (user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userAlreadyExistsError, "User with this username/email is already exists"),
			);
		}
		user = await createUser(req.body);
		if (user) {
			const accessToken = jwt.sign(user as object, <string>process.env.ACCESS_TOKEN_SECRET, {expiresIn: 21600});
			return res.status(201).send({jwt: accessToken, userId: user.id, expiresIn: Date.now() + 21600000});
		}
	});

};

export {auth};
