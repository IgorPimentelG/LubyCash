import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Admin from 'App/Models/Admin';
import AuthValidator from 'App/Validators/AuthValidator';

export default class AuthController {

	public async authenticate({ auth, request, response}: HttpContextContract) {
		try {
			const payload = await request.validate(AuthValidator);
			const admin = await Admin.findByOrFail('email', payload.email);
			const token = await auth.use('api').attempt(payload.email, payload.password, {
				expiresIn: '1hours'
			});

			return response.ok({ admin, token });
		} catch {
			return response.unauthorized({ message: 'Credenciais inválidas! '});
		}
	}

}
