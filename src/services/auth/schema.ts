import {FastifySchema} from "fastify";

const loginPost: FastifySchema = {
	"body": {
		"type": "object",
		"required": ["password"],
		"properties": {
			"password": {
				"type": "string",
				"minLength": 8,
			},
			"username": {
				"type": ["string", "null"],
				"minLength": 5,
			},
			"email": {
				"type": ["string", "null"],
				"minLength": 8,
			},
		},
	},
	"response": {
		200: {
			"type": "object",
			"properties": {
				"username": { "type": "string" },
				"jwt": { "type": "string" },
			},
		},
	},
};

const loginGet: FastifySchema = {
	"response": {
		"username": {
			"type": "string",
		},
		"email": {
			"type": "string",
		},
	},
};

const signUpPost: FastifySchema = {
	"body": {
		"type": "object",
		"required": ["username", "password", "email"],
		"properties": {
			"password": {
				"type": "string",
				"minLength": 8,
			},
			"username": {
				"type": ["string", "null"],
				"minLength": 5,
			},
			"email": {
				"type": ["string", "null"],
				"minLength": 8,
			},
		},
	},
	"response": {
		200: {
			"jwt": { "type": "string" },
		},
	},
};


export { loginPost, loginGet, signUpPost };
