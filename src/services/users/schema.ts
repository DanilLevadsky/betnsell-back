import { FastifySchema } from "fastify";

const getUserSchema: FastifySchema = {
	"response": {
		"id": { "type": "number" },
		"username": { "type": "string" },
		"email": { "type": "string" },
		"mobile": { "type": "string" },
		"name": { "type": "string" },
		"profilePic": { "type": "string" },
		"balance": { "type": "number" },
	},
};

const updateUserSchema: FastifySchema = {
	"response": {
		"id": { "type": "number" },
		"username": { "type": "string" },
		"email": { "type": "string" },
		"mobile": { "type": "string" },
		"profilePic": { "type": "string" },
	},
};


export { getUserSchema, updateUserSchema };

// TODO: update all schemas
