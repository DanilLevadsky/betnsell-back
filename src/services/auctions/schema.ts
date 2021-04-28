import { FastifySchema } from "fastify";

const postAuctionSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["lotFinishDate", "lotExpireDate", "productId"],
		properties: {
			lotFinishDate: {type: "string"},
			lotExpireDate: {type: "string"},
			productId: {type: "number"},
		},
		response: {
			"2xx": {
				type: "object",
				properties: {
					id: {type: "number"},
					createdAt: {type: "string"},
					lotFinishDate: {type: "string"},
					lotExpireDate: {type: "string"},
					productId: {type: "number"},
				},
			},
		},
	},
};

const getAuctionSchema = {
	response: {
		"2xx": {
			type: "object",
			properties: {
				id: {type: "number"},
				createdAt: {type: "string"},
				lotFinishDate: {type: "string"},
				lotExpireDate: {type: "string"},
				productId: {type: "number"},
				customerId: {type: "number"},
			},
		},
	},
};

const queryStringSchema: FastifySchema = {
	querystring: {
		type: "object",
		properties: {
			perPage: {type: "number"},
			page: {type: "number"},
		},
	},
};

export { postAuctionSchema, getAuctionSchema, queryStringSchema };
