import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { config } from "dotenv";
const prisma = new PrismaClient();

config();

const createUser = async function(data: any): Promise<any> {
	await prisma.user.create({
		data: {
			username: data.username,
			email: data.email,
			password: hashSync(data.password, <string>process.env.HASH_SALT),
			profilePic: data.profilePic || null,
			mobile: data.mobile,
			name: data.name || null,
		},
	});
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
	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
	},
	);

	return user;
};

const updateUser = async function(id: number, data: any) {
	const user = await getUserById(id);
	let updatedUser;
	if (user) {
		updatedUser = await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				...data,
			},
		}).catch((err) => {
			return { message: err.message };
		});
	}

	return updatedUser;
};


const deleteUser = async function(id: number) {
	const user = await getUserById(id);
	let userToDelete;
	if (user) {
		userToDelete = await prisma.user.delete({
			where: {
				id: user.id,
			},
		});
	}
	return userToDelete;
};

export {
	getUserByEmail,
	getUserByUsername,
	ifUserExists,
	createUser,
	getUserById,
	updateUser,
	deleteUser,
};
