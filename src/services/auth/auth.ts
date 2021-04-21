import * as dotenv from "dotenv";
import { loginPost, loginGet, signUpPost } from "./schema";
import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import {
	FastifyInstance,
	FastifyPluginCallback,
} from "fastify";
import { ifUserExists, getUserByUsername, getUserByEmail, createUser } from "../users/queries";


dotenv.config();

const auth: FastifyPluginCallback = async function(fastify: FastifyInstance): Promise<any> {

	fastify.post("/login", { schema: loginPost }, async (req: any, res: any) => {
		let user;
		if (req.body.email && req.body.username) {
			return res.status(400).send({ error: res.error.message });
		}
		if (req.body.username) {
			user = await getUserByUsername(req.body.username);
		}
		if (req.body.email) {
			user = await getUserByEmail(req.body.email);
		}
		if (!user) {
			return res.status(400).send({ error: res.error.message });
		}
		const isCorrect = await compareSync(req.body.password, user.password);
		if (!isCorrect) {
			return res.status(400).send({ error: res.error.message });
		}
		const accessToken = await jwt.sign(user, <string>process.env.ACCESS_TOKEN_SECRET, { expiresIn: 21600 });
		return res.status(200).send({ jwt: accessToken });
	});



	fastify.get("/user", { schema: loginGet }, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401).send({ error: res.error.message });
		}
		return res.status(200).send(data);
	});

	fastify.put("/register", { schema: signUpPost }, async (req:any, res:any) => {
		let user = await ifUserExists(req.body.email, req.body.username);
		if (user) {
			return res.status(400).send("User already exists");
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
			const accessToken = await jwt.sign(user as object, <string>process.env.ACCESS_TOKEN_SECRET, {expiresIn: 21600});
			return res.status(201).send({jwt: accessToken});
		}
	});

};

export { auth };
