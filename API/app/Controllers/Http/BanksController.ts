import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Client from 'App/Models/Client';
import PixValidator from 'App/Validators/Bank/PixValidator';
import { Status } from '../../../shared/model/enum/status';

export default class BanksController {
	public async pix({ auth, request, response }: HttpContextContract) {
		try {
			const { recipient_cpf, amount } = await request.validate(PixValidator);
			const client = await Client.findByOrFail('uuid', auth.use('client_api').user!.uuid);
			const recipient = await Client.findByOrFail('cpf_number', recipient_cpf);

			if (recipient.status === Status.DISAPPROVED) {
				return response.notFound({ message: 'Chave pix não cadastrada!' });
			} else if (client.currentBalance < amount) {
				return response.notAcceptable({ message: 'Saldo insuficiente!' });
			} else if (client.cpfNumber === recipient_cpf) {
				return response.notAcceptable({ message: 'Chave pix inválida!' });
			}

			recipient.currentBalance = recipient.currentBalance + amount;
			client.currentBalance = client.currentBalance - amount;

			await client.save();
			await recipient.save();

			return response.accepted({ message: 'Pix enviado com sucesso!' });
		} catch {
			return response.badRequest({ message: 'Não foi possível enviar o pix.' });
		}
	}
}
