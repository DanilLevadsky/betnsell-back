import fastify from "fastify";

const app = fastify({ logger: true });

app.get("/", (request, response) => {
	response.send({"rabotaet?": "da"});
});

app.listen(3000).catch(console.error);
