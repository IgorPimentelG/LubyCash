import { test } from '@japa/runner';
import Admin from 'App/Models/Admin';

test.group('CRUD Admin create', (group) => {
	group.each.setup(async () => {
		await Admin.create({
			fullName: 'Admin Test',
			email: 'admin@test.com',
			password: 'secret'
		});
	});

	group.each.teardown(async () => {
		const admin = await Admin.findBy('email', 'admin@test.com');
		await admin?.delete();
	});

	test('It should create a admin successfully', async ({ client, assert }) => {
		const admin = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		const response = await client.post(`${process.env.BASE_URL}/admin/create`)
			.json({
				'full_name': 'Admin 2 Test',
				'email': 'admin2@test.com',
				'password': '12345678'
			})
			.bearerToken(admin.body().token.token);

		response.assertStatus(201);
		assert.properties(response.body(), ['account']);
		assert.properties(response.body().account, ['uuid']);
	}).teardown(async () => {
		const admin = await Admin.findBy('email', 'admin2@test.com');
		await admin?.delete();
	});

	test('It should return status 401 unauthorized', async ({ client }) => {
		const response = await client.post(`${process.env.BASE_URL}/admin/create`)
			.json({
				'full_name': 'Admin 2 Test',
				'email': 'admin2@test.com',
				'password': '12345678'
			});

		response.assertStatus(401);
	});

	test('It should invalidate the incorrect data', async ({ client, assert }) => {
		const admin = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		const response = await client.post(`${process.env.BASE_URL}/admin/create`)
			.json({
				'full_name': '',
				'email': 'test@',
				'password': '1235'
			})
			.bearerToken(admin.body().token.token);

		response.assertStatus(400);
		assert.properties(response.body(), ['message']);
		assert.equal(response.body().message, 'Não foi possível criar a conta!');
	});
});
