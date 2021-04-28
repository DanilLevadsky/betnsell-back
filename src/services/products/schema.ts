import { FastifySchema } from "fastify";

const postProductSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["title", "userId", "price", "description", "photo"],
		properties: {
			title: { type: "string" },
			price: {
				type: "number",
				min: 5,
			},
			userId: { type: "number" },
			description: { type: ["string", "null"] },
			photo: { type: ["string", "null"] },
		},
	},
};

const getProductSchema: FastifySchema = {
	response: {
		"2xx": {
			id: { type: "number" },
			title: { type: "string" },
			price: { type: "number" },
			description: { type: ["string", "null"] },
			photo: { type: ["string", "null"] },
			userId: { type: "number" },
		},
	},
};

const updateTitleSchema = {
	body: {
		type: "object",
		required: ["title"],
		properties: {
			title: { type: "string" },
		},
	},
	...getProductSchema,
};

const updateDescriptionSchema = {
	body: {
		type: "object",
		required: ["description"],
		properties: {
			description: { type: "string" },
		},
	},
	...getProductSchema,
};

const updatePhotoSchema = {
	body: {
		type: "object",
		required: ["photo"],
		properties: {
			photo: { type: "string" },
		},
	},
	...getProductSchema,
};

export {
	postProductSchema,
	getProductSchema,
	updateDescriptionSchema,
	updateTitleSchema,
	updatePhotoSchema,
};
