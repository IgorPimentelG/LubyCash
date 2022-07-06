import { test } from '@japa/runner';
import Admin from 'App/Models/Admin';

test.group('CRUD Admin update', (group) => {
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

	test('It should updated the admin successfully', async ({ client, assert }) => {
		const admin = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		const adminTarget = await Admin.findBy('email', 'admin@test.com');

		const response = await client.put(`${process.env.BASE_URL}/admin/update/${adminTarget?.uuid}`)
			.json({
				'full_name': 'Luby Cash Account for Test',
				'password': '12345678'
			})
			.bearerToken(admin.body().token.token);

		response.assertStatus(200);
		assert.properties(response.body(), ['admin']);
	});

	test('It should return status 403 forbidden', async ({ client }) => {
		const adminTarget = await Admin.create({
			fullName: 'Admin 2 Test',
			email: 'admin2@test.com',
			password: 'secret'
		});

		const admin = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		const response = await client.put(`${process.env.BASE_URL}/admin/update/${adminTarget!.uuid}`)
			.json({
				'full_name': 'Luby Cash Account for Test',
				'password': '12345678'
			})
			.bearerToken(admin.body().token.token);

		response.assertStatus(403);
	}).teardown(async () => {
		const admin = await Admin.findBy('email', 'admin2@test.com');
		await admin?.delete();
	});

	test('It should invalidate the incorrect data', async ({ client, assert }) => {
		const admin = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		const adminTarget = await Admin.findBy('email', 'admin@test.com');

		const response = await client.put(`${process.env.BASE_URL}/admin/update/${adminTarget!.uuid}`)
			.json({
				'full_name': '',
			})
			.bearerToken(admin.body().token.token);

		response.assertStatus(400);
		assert.properties(response.body(), ['message']);
		assert.equal(response.body().message, 'Informe os dados a serem atualizados!');
	});
});
