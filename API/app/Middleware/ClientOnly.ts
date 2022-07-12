import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Client from 'App/Models/Client';
import { Status } from '../../shared/model/enum/status';

export default class ClientOnly {
	public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
		try {
			const uuid = auth.user!.uuid;
			const client = await Client.findByOrFail('uuid', uuid);

			if (client.status === Status.DISAPPROVED) {
				return response.forbidden();
			}

			await next();
		} catch {
			return response.forbidden();
		}
	}
}
