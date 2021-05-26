import { FastifySchema } from "fastify";

const shortAuctionSchema: FastifySchema = {
	response: {
		"2xx": {
			type: "object",
			properties: {
				id: {type: "number"},
				product: {
					type: "object",
					properties: {
						id: {type: "number"},
						title: {type: "string"},
						description: {type: ["string", "null"]},
						photo: {type: ["string", "null"]},
						userId: {type: "number"},
					},
				},
				lotExpireDate: {type: "string"},
				lotFinishDate: {type: ["string", "null"]},
				createdAt: {type: "string"},
				totalPrice: {type: "number"},
				status: {type: "string"},
			},
		},
	},
};

const postAuctionSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["productId", "pricePerTicket", "totalTickets"],
		properties: {
			productId: {type: "number"},
			pricePerTicket: {type: "number"},
			totalTickets: {type: "number"},
		},
		...shortAuctionSchema,
	},
};

const getAuctionSchema = {
	response: {
		"2xx": {
			type: "object",
			properties: {
				id: {type: "number"},
				createdAt: {type: "string"},
				lotFinishDate: {type: ["string", "null"]},
				lotExpireDate: {type: "string"},
				pricePerTicket: {type: "number"},
				totalTickets: {type: "number"},
				totalPrice: {type: "number"},
				product: {
					type: "object",
					properties: {
						id: {type: "number"},
						title: {type: "string"},
						description: {type: ["string", "null"]},
						photo: {type: ["string", "null"]},
						userId: {type: "number"},
					},
				},
				winnerId: {type: ["number", "null"]},
				tickets: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {type: "number"},
							ticketNumber: {type: "number"},
							userId: {type: ["number", "null"]},
						},
					},
				},
			},
		},
	},
};


const getAllAuctionsSchema = {
	querystring: {
		type: "object",
		properties: {
			perPage: {type: "number"},
			page: {type: "number"},
		},
	},
	response: {
		"2xx": {
			type: "object",
			properties: {
				pageSize: {type: "number"},
				currentPage: {type: "number"},
				totalPages: {type: "number"},
				content: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {type: "number"},
							product: {
								type: "object",
								properties: {
									id: {type: "number"},
									title: {type: "string"},
									description: {type: ["string", "null"]},
									photo: {type: ["string", "null"]},
									userId: {type: "number"},
								},
							},
							lotExpireDate: {type: "string"},
							lotFinishDate: {type: ["string", "null"]},
							createdAt: {type: "string"},
							totalPrice: {type: "number"},
							status: {type: "string"},
						},
					},
				},
			},
		},
	},
};


export {
	postAuctionSchema,
	getAuctionSchema,
	getAllAuctionsSchema,
	shortAuctionSchema,
};
