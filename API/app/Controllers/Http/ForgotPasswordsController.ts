import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Admin from 'App/Models/Admin';
import Client from 'App/Models/Client';
import Event from '@ioc:Adonis/Core/Event';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import StoreValidator from 'App/Validators/ForgotPassword/StoreValidator';
import ForgotPassword from 'App/Models/ForgotPassword';
import UpdateValidator from 'App/Validators/ForgotPassword/UpdateValidator';

export default class ForgotPasswordsController {
	public async store({ request, response }: HttpContextContract) {
		try {
			const { email } = await request.validate(StoreValidator);
			let user: Client | Admin | null = await Client.findBy('email', email);

			if (!user) user = await Admin.findBy('email', email);
			if (!user) return response.notFound({ message: 'Usuário não encontrado!' });

			const tokenRegistered = await ForgotPassword.findBy('user_uuid', user.uuid);

			let token = '';

			if (tokenRegistered) {
				token = tokenRegistered.token;
			} else {
				const random = await promisify(randomBytes)(24);
				token = random.toString('hex');
				await ForgotPassword.create({ token, user_uuid: user.uuid });
			}

			Event.emit('user:forgot-password', {
				email: user.email,
				firstName: user.fullName.split(' ')[0],
				token
			});

			return response.ok({ message: 'Verifique seu e-mail!' });
		} catch(error) {
			return response.notFound({ message: 'Não foi possível recuperar a senha!', error});
		}
	}

	public async update({ request, response }: HttpContextContract) {
		try {
			const token = request.param('token');
			const { password } = await request.validate(UpdateValidator);
			const tokenRegistered = await ForgotPassword.findByOrFail('token', token);

			let user: Client | Admin | null = await Client.findBy('uuid', tokenRegistered.user_uuid);

			if (!user) user = await Admin.findBy('uuid', tokenRegistered.user_uuid);
			if (!user) return response.notFound({ message: 'Usuário não encontrado!' });

			user.password = password;
			await user.save();
			await tokenRegistered.delete();

			return response.accepted({ message: 'Senha alterada com sucesso!' });
		} catch(error) {
			response.badRequest({ message: 'Token Inválido!', error });
		}
	}
}
