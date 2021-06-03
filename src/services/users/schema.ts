import { FastifySchema } from "fastify";

const shortUserSchema: FastifySchema = {
	response: {
		"2xx": {
			id: {type: "number"},
			username: {type: "string"},
			profilePic: {type: ["string", "null"]},
		},
	},
};

const generalUserSchema: FastifySchema = {
	response: {
		"2xx": {
			id: {type: "number"},
			username: {type: "string"},
			balance: {type: "number"},
			profilePic: {type: ["string", "null"]},
			userInfo: {
				type: "object",
				properties: {
					email: {type: "string"},
					mobile: {type: ["string", "null"]},
					name: {type: ["string", "null"]},
				},
			},
		},
	},
};

const getUserSchema: FastifySchema = {
	response: {
		"2xx": {
			id: { type: "number" },
			username: { type: "string" },
			email: { type: "string" },
			mobile: { type: ["string", "null"] },
			name: { type: ["string", "null"] },
			profilePic: { type: ["string", "null"] },
			balance: { type: "number" },
		},
	},
};

const updateUsernameSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["username"],
		properties: {
			username: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateEmailSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["email"],
		properties: {
			email: { type: "string" },
		},
	},
	...getUserSchema,
};

const updatePasswordSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["password"],
		properties: {
			password: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateNameSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["name"],
		properties: {
			name: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateMobileSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["mobile"],
		properties: {
			mobile: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateProfilePicSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["profilePic"],
		properties: {
			profilePic: { type: "string" },
		},
	},
	...getUserSchema,
};

const updateBalanceSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["sum"],
		properties: {
			sum: { type: "number" },
		},
	},
	...getUserSchema,
};

const getUserProductsSchema: FastifySchema = {
	response: {
		"2xx": {
			userId: {type: "number"},
			pageSize: {type: "number"},
			totalPages: {type: "number"},
			currentPage: {type: "number"},
			content: {
				type: "array",
				items: {
					type: "object",
					properties: {
						id: {type: "number"},
						title: {type: "string"},
						description: {type: ["string", "null"]},
						photo: {type: ["string", "null"]},
						isBusy: {type: "boolean"},
						auction: {
							type: ["object", "null"],
							properties: {
								id: {type: "number"},
							},
						},
					},
				},
			},
		},
	},
};

const getUserAuctionsSchema: FastifySchema = {
	response: {
		"2xx": {
			userId: {type: "number"},
			pageSize: {type: "number"},
			totalPages: {type: "number"},
			currentPage: {type: "number"},
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
};


export {
	getUserSchema,
	updateEmailSchema,
	updateMobileSchema,
	updateNameSchema,
	updatePasswordSchema,
	updateProfilePicSchema,
	updateUsernameSchema,
	updateBalanceSchema,
	shortUserSchema,
	generalUserSchema,
	getUserProductsSchema,
	getUserAuctionsSchema,
};

