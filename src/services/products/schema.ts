import { FastifySchema } from "fastify";

const generalProductSchema = {
	response: {
		"2xx": {
			id: {type: "number"},
			title: {type: "string"},
			description: {type: ["string", "null"]},
			photo: {type: ["string", "null"]},
			userId: {type: "number"},
			auction: {
				type: ["object", "null"],
				properties: {
					id: {type: "number"},
					updatedAt: {type: "string"},
					createdAt: {type: "string"},
					lotFinishDate: {type: ["string", "null"]},
					lotExpireDate: {type: "string"},
 					pricePerTicket: {type: "number"},
					totalTickets: {type: "number"},
					totalPrice: {type: "number"},
					winnerId: {type: ["number", "null"]},
				},
			},			
		},
	},
};

const postProductSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["title", "description", "photo"],
		properties: {
			title: { type: "string", minLength: 5 },
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
			title: { type: "string", minLength: 5 },
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
	generalProductSchema,
	postProductSchema,
	getProductSchema,
	updateDescriptionSchema,
	updateTitleSchema,
	updatePhotoSchema,
};
