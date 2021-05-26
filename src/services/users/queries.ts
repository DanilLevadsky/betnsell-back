import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { config } from "dotenv";
import {deleteProductsByUser} from "../products/queries";
const prisma = new PrismaClient();

config();

const createUser = async function(data: any): Promise<any> {

	const user = await prisma.user.create({
		data: {
			username: data.username,
			email: data.email,
			password: hashSync(data.password, 10),
		}});
	if (user) {
		const data: any = {};
		Object.entries(user).forEach((arr) => {
			if (arr[0] === "password" ) {
				return;
			}
			data[arr[0]] = arr[1];
		});
		return data;
	}
};

const getUserByUsername = async function(username: string) {
	const user = await prisma.user.findUnique(
		{ where: {
			username: username,
		},
		});
	return user;
};

const getUserByEmail = async function(email: string) {
	const user = await prisma.user.findUnique(
		{ where: {
			email: email,
		},
		});
	return user;
};

const ifUserExists = async function(email: string, username: string) {
	return await getUserByEmail(email) || await getUserByUsername(username);
};

const getUserById = async function(id: number) {
	return await prisma.user.findUnique({
		where: {
			id: id,
		},
	});
};

const updateUsername = async function (id: number, username: string) {
	return await prisma.user.update({
		data: {
			username: username,
		},
		where: {
			id: id,
		},
	});
};

const updateEmail = async function (id: number, email: string) {
	return await prisma.user.update({
		data: {
			email: email,
		},
		where: {
			id: id,
		},
	});
};

const updatePassword = async function (id: number, password: string) {
	return await prisma.user.update({
		data: {
			password: hashSync(password, 10),
		},
		where: {
			id: id,
		},
	});
};

const updateName = async function (id: number, name: string) {
	return await prisma.user.update({
		data: {
			name: name,
		},
		where: {
			id: id,
		},
	});
};

const updateMobile = async function (id: number, mobile: string) {
	return await prisma.user.update({
		data: {
			mobile: mobile,
		},
		where: {
			id: id,
		},
	});
};

const updateProfilePic = async function (id: number, profilePic: string) {
	return await prisma.user.update({
		data: {
			mobile: profilePic,
		},
		where: {
			id: id,
		},
	});
};

// TODO: VERY LATELY upgrade to GameMoney.
const addFunds = async function (userId: number, sum: number) {
	const user = await getUserById(userId);
	if (user) {
		return await prisma.user.update({
			data: {
				balance: user.balance + sum,
			},
			where: {
				id: userId,
			},
		});
	}
	return null;
};

const deleteUser = async function(id: number) {
	const user = await getUserById(id);
	if (user) {
		await deleteProductsByUser(id);
		return await prisma.user.delete({
			where: {
				id: id,
			},
		});
	}
	return null;
};

// Only for tests
const deleteUserByUsername = async function(username: string) {
	const user = await getUserByUsername(username);
	if (user) {
		await deleteProductsByUser(user.id);
		return await prisma.user.delete({
			where: {
				id: user.id,
			},
		});
	}
};

export {
	getUserByEmail,
	getUserByUsername,
	ifUserExists,
	createUser,
	getUserById,
	deleteUser,
	updateUsername,
	updateEmail,
	updateMobile,
	updateName,
	updatePassword,
	updateProfilePic,
	addFunds,
	deleteUserByUsername,
};
