import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Admin from 'App/Models/Admin';

export default class AdminOnly {
	public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
		try {
			const uuid = auth.user.uuid;
			await Admin.findByOrFail('uuid', uuid);
			await next();
		} catch {
			return response.forbidden();
		}
	}
}
