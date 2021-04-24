import {FastifySchema} from "fastify/types/schema";

const queryStringSchema: FastifySchema = {
	"querystring": {
		"type": "object",
		"properties": {
			"perPage": {"type": "number"},
			"page": {"type": "number"},
		},
	},
};

export {
	queryStringSchema,
};
