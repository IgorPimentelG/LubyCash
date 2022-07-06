import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Admin from 'App/Models/Admin';
import CreateAdminValidator from 'App/Validators/CreateAdminValidator';
import UpdateAdminValidator from 'App/Validators/UpdateAdminValidator';

export default class AdminsController {
	public async store({ request, response }: HttpContextContract) {
		try {
			const payload = await request.validate(CreateAdminValidator);
			const account = await Admin.create(payload);
			return response.created({ account });
		} catch {
			return response.badRequest({ message: 'Não foi possível criar a conta!' });
		}
	}

	public async update({ request, response, bouncer }: HttpContextContract) {
		try {
			const uuid = request.param('uuid');
			const admin = await Admin.findByOrFail('uuid', uuid);
			const { full_name, password } = await request.validate(UpdateAdminValidator);

			await bouncer.authorize('owner', admin);

			if (full_name) admin.fullName = full_name;
			if (password) admin.password = password;

			await admin.save();

			return response.ok({ admin });
		} catch(error) {
			return response.status(error.status);
		}
	}

	public async show({ response }: HttpContextContract) {
		const accounts = await Admin.all();
		return response.ok({ accounts });
	}

	public async destroy({ request, response, bouncer }: HttpContextContract) {
		try {
			const uuid = request.param('uuid');
			const admin = await Admin.findByOrFail('uuid', uuid);

			await bouncer.authorize('owner', admin);
			await admin.delete();

			return response.ok({ admin });
		} catch(error) {
			return response.status(error.status);
		}
	}
}
