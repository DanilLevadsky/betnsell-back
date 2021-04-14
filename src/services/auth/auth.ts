import * as dotenv from "dotenv";
import { users } from "../../constants/config";
import { loginPost, loginGet, signUpPost } from "./schema";
import jwt from "jsonwebtoken";
import {compareSync, hashSync} from "bcryptjs";
import {
	FastifyInstance,
	FastifyPluginCallback,
} from "fastify";
import { ifUserExists, getUserByUsername, getUserByEmail, createUser } from "../users/users";


dotenv.config();

const auth: FastifyPluginCallback = async function(fastify: FastifyInstance): Promise<any> {

	fastify.post("/login", { schema: loginPost }, async (req: any, res: any) => {
		let user;
		if (req.body.email && req.body.username) {
			return res.status(400);
		}
		if (req.body.username) {
			user = await getUserByUsername(req.body.username);
		}
		if (req.body.email) {
			user = await getUserByEmail(req.body.email);
		}
		if (!user) {
			return res.status(400);
		}
		const isCorrect = await compareSync(req.body.password, user.password);
		if (!isCorrect) {
			return res.status(400).send("incorrect username or password");
		}
		const accessToken = await jwt.sign(user, <string>process.env.ACCESS_TOKEN_SECRET, { expiresIn: 21600 });
		return res.status(200).send({ jwt: accessToken });
	});

	fastify.get("/login", { schema: loginGet }, async (req: any, res: any) => {
		const token = req.headers.authorization.split(" ")[1];
		const data = jwt.verify(token, <string>process.env.ACCESS_TOKEN_SECRET);
		if (!data) {
			return res.status(401);
		}
		return res.status(200).send(data);
	});

	fastify.post("/register", { schema: signUpPost }, async (req:any, res:any) => {
		const user = await ifUserExists(req.body.email, req.body.username);
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
		await createUser(data);
		const accessToken = await jwt.sign(data, <string>process.env.ACCESS_TOKEN_SECRET, { expiresIn: 21600 });
		return res.status(200).send({jwt: accessToken});
	});

};

// const getUserByUsername = function(username: string) {
// 	return users.find(x => x.username === username);
// };
//
// const getUserByEmail = function(email: string) {
// 	return users.find(x => x.email === email);
// };


export { auth };
