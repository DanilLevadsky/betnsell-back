import { FastifySchema } from "fastify";

const loginByEmail: FastifySchema = {
	body: {
		type: "object",
		required: ["email", "password"],
		properties: {
			password: {
				type: "string",
				minLength: 8,
			},
			email: {
				type: "string",
			},
		},
	},
	response: {
		"2xx": {
			type: "object",
			properties: {
				userId: { type: "number" },
				jwt: { type: "string" },
				expiresIn: { type: "number" },
			},
		},
	},
};

const loginByUsername: FastifySchema = {
	body: {
		type: "object",
		required: ["username", "password"],
		properties: {
			password: {
				type: "string",
			},
			username: {
				type: "string",
			},
		},
	},
	response: {
		"2xx": {
			type: "object",
			properties: {
				userId: { type: "number" },
				jwt: { type: "string" },
				expiresIn: { type: "number" },
			},
		},
	},
};

const loginGet: FastifySchema = {
	response: {
		"2xx": {
			id: { type: "number" },
			username: { type: "string" },
			email: { type: "string" },
			mobile: { type: ["string", "null"] },
			profilePic: { type: ["string", "null"] },
			balance: { type: ["number", "null"] },
			name: { type: ["string", "null"] },
			iat: { type: "number" },
			exp: { type: "number" },
		},
	},
};

const signUpPost: FastifySchema = {
	body: {
		type: "object",
		required: ["username", "password", "email"],
		properties: {
			password: { type: "string", minLength: 8 },
			username: { type: "string", minLength: 8 },
			email: { type: "string" },
		},
	},
	response: {
		"2xx": {
			type: "object",
			properties: {
				jwt: { type: "string" },
				userId: { type: "number" },
				expiresIn: { type: "number" },
			},
		},
	},
};


export { loginGet, signUpPost, loginByEmail, loginByUsername };
