import { hashSync } from "bcryptjs";

export const users = [{
	username: "User1",
	password: hashSync("User1pass", 10),
	email: "user1@gmail.com",
}];
