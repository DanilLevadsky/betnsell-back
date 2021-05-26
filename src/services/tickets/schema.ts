import {FastifySchema} from "fastify";

const ticketSchema: FastifySchema = {
	response: {
		"2xx": {
			type: "object",
			properties: {
				status: {type: "string"},
			},
		},
	},
};

export {ticketSchema};
