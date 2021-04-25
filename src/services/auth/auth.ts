import * as dotenv from "dotenv";
import {loginGet, loginPost, signUpPost} from "./schema";
import jwt from "jsonwebtoken";
import {compareSync} from "bcryptjs";
import {FastifyInstance, FastifyPluginCallback} from "fastify";
import {
	createUser,
	getUserByEmail,
	getUserByUsername,
	ifUserExists,
} from "../users/queries";
import {RequestError} from "../../utils/error";
import {ErrorTypes} from "../../constants/errorConstants";


dotenv.config();

const auth: FastifyPluginCallback = async function(fastify: FastifyInstance): Promise<any> {

	fastify.post("/login/email", { schema: loginPost }, async (req: any, res: any) => {
		const user = await getUserByEmail(req.body.email);
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

	fastify.post("/login/username", { schema: loginPost }, async (req: any, res: any) => {
		const user = await getUserByUsername(req.body.username);
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

	fastify.get("/user", { schema: loginGet }, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send(
				new RequestError(401, ErrorTypes.invalidAuthTokenError, "Token is invalid"),
			);
		}
		return res.status(200).send(data);
	});

	fastify.put("/register", { schema: signUpPost }, async (req: any, res: any) => {
		let user = await ifUserExists(req.body.email, req.body.username);
		if (user) {
			return res.status(400).send(
				new RequestError(400, ErrorTypes.userAlreadyExistsError, "User with this username/email is already exists"),
			);
		}
		const data = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			profilePic: req.body.profilePic || null,
			mobileNum: req.body.mobile,
			name: req.body.name || null,
		};
		user = await createUser(data);
		if (user) {
			const accessToken = jwt.sign(user as object, <string>process.env.ACCESS_TOKEN_SECRET, {expiresIn: 21600});
			return res.status(201).send({jwt: accessToken});
		}
	});

};

export { auth };
