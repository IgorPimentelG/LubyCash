import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Admin from 'App/Models/Admin';
import Client from 'App/Models/Client';
import AuthValidator from 'App/Validators/AuthValidator';

export default class AuthController {

	public async authenticateAdmin({ auth, request, response}: HttpContextContract) {
		try {
			const payload = await request.validate(AuthValidator);
			const admin = await Admin.findByOrFail('email', payload.email);
			const token = await auth.use('admin_api').attempt(payload.email, payload.password, {
				expiresIn: '1hours'
			});

			return response.ok({ admin, token });
		} catch {
			return response.unauthorized({ message: 'Credenciais inválidas!'});
		}
	}

	public async authenticateClient({ auth, request, response}: HttpContextContract) {
		try {
			const payload = await request.validate(AuthValidator);
			const client = await Client.findByOrFail('email', payload.email);
			const token = await auth.use('client_api').attempt(payload.email, payload.password, {
				expiresIn: '1hours'
			});

			return response.ok({ client, token });
		} catch {
			return response.unauthorized({ message: 'Credenciais inválidas!'});
		}
	}

}
