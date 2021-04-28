import { FastifySchema } from "fastify";

const getUserSchema: FastifySchema = {
	response: {
		"2xx": {
			id: { type: "number" },
			username: { type: "string" },
			email: { type: "string" },
			mobile: { type: ["string", "null"] },
			name: { type: ["string", "null"] },
			profilePic: { type: ["string", "null"] },
			balance: { type: "number" },
		},
	},
};


const updateUsernameSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["username"],
		properties: {
			username: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateEmailSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["email"],
		properties: {
			email: { type: "string" },
		},
	},
	...getUserSchema,
};

const updatePasswordSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["password"],
		properties: {
			password: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateNameSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["name"],
		properties: {
			name: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateMobileSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["mobile"],
		properties: {
			mobile: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateProfilePicSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["profilePic"],
		properties: {
			profilePic: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateBalanceSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["sum"],
		properties: {
			sum: { type: "number" },
		},
	},
	...getUserSchema,
};


export {
	getUserSchema,
	updateEmailSchema,
	updateMobileSchema,
	updateNameSchema,
	updatePasswordSchema,
	updateProfilePicSchema,
	updateUsernameSchema,
	updateBalanceSchema,
};

