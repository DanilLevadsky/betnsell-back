import tap from "tap";
import { server } from "../server";
import { deleteUser } from "../services/users/queries";

const endUseCaseTest = async() => {
	await server.close();
	process.exit(0);
};

const userData = {
	username: "JohnDoee",
	password: "password",
	email: "johndoe@mail.test",
};

const testUseCase = () => tap.test("Testing use-case scenario for user", async t => {
	let token: string;
	let userId: number;
	let productId: number;
	const pricePerTicket: number = 5;
	const totalTickets: number = 5;
	t.teardown(endUseCaseTest);

	await t.test("User create account to use", async t => {
		const response = await server.inject({
			url: "/auth/register",
			method: "PUT",
			payload: userData,
		});

		const data = JSON.parse(response.payload);
		token = data.jwt;
		t.equal(response.statusCode, 201, "Sucessfully registered");
	});

	await t.test("Try to get your profile", async t => {
		const response = await server.inject({
			url: "/users",
			method: "GET",
			headers: {
				authorization: `BEARER ${token}`,
			},
		});
        
		const data = JSON.parse(response.payload);
		userId = parseInt(data.id);
		t.equal(response.statusCode, 200, "Sucessfully registered");
	});

	await t.test("Try to create product", async t => {
		const response = await server.inject({
			url: "/products/create",
			method: "PUT",
			payload: {
				title: "Test item",
				description: null,
				photo: null,
			},
			headers: {
				authorization: `BEARER ${token}`,
			},
		});
		const data = JSON.parse(response.payload);
		productId = parseInt(data.id);
		t.equal(response.statusCode, 201, "Product created succesfully");
	});

	await t.test("Try to update product field", async t => {
		const response = await server.inject({
			url: `/products/${productId}/title`,
			method: "PATCH",
			payload: {
				title: "Updated Test item",
			},
			headers: {
				authorization: `BEARER ${token}`,
			},
		});
		t.equal(response.statusCode, 200, "Product updated succesfully");
	});

	await t.test("Try to create auction for test product", async t => {
		const response = await server.inject({
			url: "/auctions/create",
			method: "PUT",
			payload: {
				productId: productId,
				pricePerTicket: pricePerTicket,
				totalTickets: totalTickets,
			},
			headers: {
				authorization: `BEARER ${token}`,
			},
		});
		t.equal(response.statusCode, 201, "Auction created succesfully");
	});

	await t.test("Try to update product title during auction", async t => {
		const response = await server.inject({
			url: `/products/${productId}/title`,
			method: "PATCH",
			payload: {
				title: "New Updated Test item",
			},
			headers: {
				authorization: `BEARER ${token}`,
			},
		});
		t.equal(response.statusCode, 403, "Product cannot be updated during auction");
	});

	await t.test("Testing user deleting", async t => {
		const response = await server.inject({
			url: "/users/delete",
			method: "DELETE",
			headers: {
				authorization: `BEARER ${token}`,
			},
		});
		t.equal(response.statusCode, 204, "Successfully deleted");
	});

	t.end();
});

testUseCase();
