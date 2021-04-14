import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

const createUser = async function(data: any): Promise<any> {
	await prisma.user.create({
		data: {
			username: data.username,
			email: data.email,
			password: hashSync(data.password, 10),
			profilePic: data.profilePic || null,
			mobileNum: data.mobile,
			name: data.name || null,
		},
	});
};

const getUserByUsername = async function(username: string) {
	return await prisma.user.findUnique(
		{ where: {
			username: username,
		},
		});
};

const getUserByEmail = async function(email: string) {
	return await prisma.user.findUnique(
		{ where: {
			email: email,
		},
		});
};

const ifUserExists = async function(email: string, username: string) {
	return await getUserByEmail(email) || await getUserByUsername(username);
};


export { getUserByEmail, getUserByUsername, ifUserExists, createUser };
