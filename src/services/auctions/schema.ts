import { FastifySchema } from "fastify";

const postAuctionSchema: FastifySchema = {
	body: {
		type: "object",
		// TODO: удалить поля с датами и сделать чтоб они автогенерировались
		// TODO: auction add ticket count and ticket price
		// TODO: РЕМУВ product price
		required: ["productId"],
		properties: {
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
