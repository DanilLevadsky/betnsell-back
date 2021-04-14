import * as dotenv from "dotenv";
import { users } from "../../constants/config";
import { loginPost, loginGet, signUpPost } from "./schema";
import jwt from "jsonwebtoken";
import {compareSync, hashSync} from "bcryptjs";
import {
	FastifyInstance,
	FastifyPluginCallback,
} from "fastify";

dotenv.config();

const routes: FastifyPluginCallback = async function(fastify: FastifyInstance): Promise<any> {

	fastify.post("/login", { schema: loginPost }, async (req: any, res: any) => {
		let user;
		if (req.body.email && req.body.username) {
			return res.status(400);
		}
		if (req.body.username) {
			user = getUserByUsername(req.body.username);
		}
		if (req.body.email) {
			user = getUserByEmail(req.body.email);
		}
		if (!user) {
			return res.status(400);
		}
		const isCorrect = compareSync(req.body.password, user.password);
		if (!isCorrect) {
			return res.status(400);
		}
		const accessToken = await jwt.sign(user, <string>process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
		return res.status(200).send({ jwt: accessToken });
	});

	fastify.get("/login", { schema: loginGet }, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		return res.status(200).send(data);
	});

	fastify.post("/register", { schema: signUpPost }, async (req:any, res:any) => {
		const user = users.find(x => (x.username === req.body.username) || (x.email === req.body.email));
		if (user) {
			return res.status(400).send("User already exists");
		}
		const newUser = {
			username: req.body.username,
			email: req.body.email,
			password: hashSync(req.body.password, 10),
		};
		users.push(newUser);
		return res.status(200).send(newUser);
	});

};

const getUserByUsername = function(username: string) {
	return users.find(x => x.username === username);
};

const getUserByEmail = function(email: string) {
	return users.find(x => x.email === email);
};


export { routes };
