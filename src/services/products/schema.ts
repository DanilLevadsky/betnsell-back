import { FastifySchema } from "fastify";

const postProductSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["title", "description", "photo"],
		properties: {
			title: { type: "string" },
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
			description: { type: ["string", "null"] },
		},
	},
	...getProductSchema,
};

const updatePhotoSchema = {
	body: {
		type: "object",
		required: ["photo"],
		properties: {
			photo: { type: ["string", "null"] },
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
