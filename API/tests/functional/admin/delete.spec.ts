/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { test } from '@japa/runner';
import Admin from 'App/Models/Admin';

test.group('CRUD Admin delete', (group) => {
	group.each.setup(async () => {
		await Admin.create({
			fullName: 'Admin Test',
			email: 'admin@test.com',
			password: 'secret'
		});
	});

	test('It should return status 403 forbidden', async ({ client }) => {
		const adminTarget = await Admin.create({
			fullName: 'Admin 2 Test',
			email: 'admin2@test.com',
			password: 'secret'
		});

		const admin = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		const response = await client.delete(`${process.env.BASE_URL}/admin/delete/${adminTarget!.uuid}`)
			.bearerToken(admin.body().token.token);

		response.assertStatus(403);
	}).teardown(async () => {
		const admin1 = await Admin.findBy('email', 'admin2@test.com');
		const admin2 = await Admin.findBy('email', 'admin@test.com');
		await admin1?.delete();
		await admin2?.delete();
	});

	test('It should deleted the account successfully', async ({ client, assert }) => {
		const admin = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		const adminTarget = await Admin.findBy('email', 'admin@test.com');

		const response = await client.delete(`${process.env.BASE_URL}/admin/delete/${adminTarget!.uuid}`)
			.bearerToken(admin.body().token.token);

		response.assertStatus(200);
		assert.properties(response.body(), ['admin']);
	});
});
