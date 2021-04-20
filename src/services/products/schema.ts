import { FastifySchema } from "fastify";

const postProductSchema: FastifySchema = {
	"body": {
		"data": {
			"type": "object",
			"required": ["title", "userId", "price"],
			"properties": {
				"title": {
					"type": "string",
					"minLength": 5,
				},
				"price": {
					"type": "number",
					"min": 5,
				},
				"userId": {
					"type": "number",
				},
				"description": {
					"type": "string",
				},
				"photo": {
					"type": "string",
				},
			},
		},
	},
};

export {
	postProductSchema,
};
