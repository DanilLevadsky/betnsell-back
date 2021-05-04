import { ErrorTypes } from "../constants/errorConstants";

export class RequestError {
	statusCode: number;
	type: ErrorTypes;
	message: string;
	time: number;

	constructor(statusCode: number, type: ErrorTypes, message: string) {
		this.statusCode = statusCode;
		this.type = type;
		this.message = message;
		this.time = Date.now();
	}
}

