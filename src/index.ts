import * as http from "http";
import * as serverConstants from "./constants/serverConstants";

const requestListener = function(
	request: http.IncomingMessage,
	response: http.ServerResponse,
) {
	response.writeHead(200);
	response.end("first server");
};

const server = http.createServer(requestListener);
server.listen(serverConstants.PORT, serverConstants.HOST, () => {
	console.log(`server is running on http://${serverConstants.HOST}:${serverConstants.PORT}`);
});
