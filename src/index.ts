import * as http from "http";

const host = "localhost";
const port = 8000;

const requestListener = function (
	request: http.IncomingMessage,
	response: http.ServerResponse,
) {
	response.writeHead(200);
	response.end("first server");
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log(`server is running on http://${host}:${port}`);
});
