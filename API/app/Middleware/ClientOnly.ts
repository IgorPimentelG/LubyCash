import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Client from 'App/Models/Client';

export default class ClientOnly {
	public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
		try {
			const uuid = auth.user.uuid;
			await Client.findByOrFail('uuid', uuid);
			await next();
		} catch {
			return response.forbidden();
		}
	}
}
