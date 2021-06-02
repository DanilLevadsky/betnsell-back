import tap from "tap";
import { server } from "../server";

const endAuthTest = async () => {
	await server.close();
	process.exit(0);
};

const userInfo = {
	username: "testuser",
	password: "password",
	email: "test@i.ua",
};
const invalidUserInfo = {
	username: "tstusr",
	password: "psswrd",
	email: "test@i.ua",
};

const testAuth = () => tap.test("Testing authentication", async t => {
	let token: any;

	t.teardown(endAuthTest);

	await t.test("Try to authenticate with invalid data", async t => {
		const response = await server.inject({
			url: "/auth/login/username",
			method: "POST",
			payload: {
				username: "",
				password: "p@$$w0rd",
			},
		});
		t.equal(response.statusCode, 400, "Username length should be more than 8 characters");
	});

	await t.test("Try to register new user with invalid input data", async t => {
		const response = await server.inject({
			url: "/auth/register",
			method: "PUT",
			payload: invalidUserInfo,
		});
		t.equal(response.statusCode, 400, "Username and password should be longer than 8 chars");
	});

	await t.test("Try to register user with correct data", async t => {
		const response = await server.inject({
			url: "/auth/register",
			method: "PUT",
			payload: userInfo,
		});
		t.equal(response.statusCode, 201, "Successfully registered");
	});

	await t.test("Try to create user with taken username or email", async t => {
		const response = await server.inject({
			url: "/auth/register",
			method: "PUT",
			payload: userInfo,
		});
		t.equal(response.statusCode, 400, "Username/Email already taken");
	});

	await t.test("Try to authenticate", async t => {
		const response = await server.inject({
			url: "/auth/login/username",
			method: "POST",
			payload: {
				username: userInfo.username,
				password: userInfo.password,
			},
		});
		const data = JSON.parse(response.payload);
		token = data.jwt;
		t.equal(response.statusCode, 200, "Successfully authorized");
	});

	await t.test("Try to get info of user who created in previous steps", async t => {
		const response = await server.inject({
			url: "/users/",
			method: "GET",
			headers: {
				authorization: `BEARER ${token}`,
			},
		});
		t.equal(response.statusCode, 200, "Success");
		const user = JSON.parse(response.payload);
		t.equal(user.username, userInfo.username, "Same username");
		t.equal(user.userInfo.email, userInfo.email, "Same email");
		t.equal(user.balance, 0, "On creation moment user balance was set to 0");
	});

	await t.test("Try to get user info with invalid token", async t => {
		const response = await server.inject({
			url: "/users/",
			method: "GET",
			headers: {
				authorization: "BEARER INVALIDTOKEN",
			},
		});
		t.equal(response.statusCode, 401, "Unauthorized");
	});

	await t.test("Testing updating userInfo", async t => {
		const response = await server.inject({
			url: "/users/update/username",
			method: "PATCH",
			headers: {
				authorization: `BEARER ${token}`,
			},
			payload: {
				username: "newtestuser",
			},
		});
		const payload = JSON.parse(response.payload);
		t.equal(response.statusCode, 200, "Successful");
		t.not(payload.username, userInfo.username, "New username different from previous");
		t.equal(payload.email, userInfo.email, "Changed only username");
		t.equal(payload.mobile, null);
		userInfo.username = "newtestuser";
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

testAuth().catch(console.error);
