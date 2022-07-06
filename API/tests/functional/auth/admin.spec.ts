import { test } from '@japa/runner';
import Admin from 'App/Models/Admin';

test.group('Auth admin', (group) => {

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

	test('It should authenticate the admin', async ({ client, assert }) => {
		const response = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: 'secret' });

		response.assertStatus(200);
		assert.isTrue(response.hasBody());
		assert.properties(response.body(), ['admin', 'token']);
		assert.notProperty(response.body().admin, 'password');
	});

	test('It should throw an error when authenticate the admin', async ({ client, assert }) => {
		const response = await client.post(`${process.env.BASE_URL}/admin/sign-in`)
			.json({ email: 'admin@test.com', password: '1234567' });

		response.assertStatus(401);
		assert.isTrue(response.hasBody());
		assert.properties(response.body(), ['message']);
		assert.equal(response.body().message, 'Credenciais inválidas!');
	 });
});
