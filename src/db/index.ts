import { constants } from "../constants/configConstants";
import {ConnectionOptions, createConnection} from "typeorm";

const db = createConnection(constants.dbConfig as ConnectionOptions)
	.catch(console.log);

export default db;
