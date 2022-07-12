/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Client from 'App/Models/Client';
import Event from '@ioc:Adonis/Core/Event';
import DepositValidator from 'App/Validators/Bank/DepositValidator';
import PixValidator from 'App/Validators/Bank/PixValidator';
import WithdrawValidator from 'App/Validators/Bank/WithdrawValidator';
import { Status } from '../../../shared/model/enum/status';

export default class BanksController {
	public async pix({ auth, request, response }: HttpContextContract) {
		try {
			const { recipient_cpf, amount } = await request.validate(PixValidator);
			const client = await Client.findByOrFail('uuid', auth.user!.uuid);
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

			Event.emit('bank:extract', {
				uuid: client.uuid,
				input: 0,
				output: amount,
				balance: client.currentBalance,
				description: `Transferência enviada para ${recipient.fullName}.`
			});

			Event.emit('bank:extract', {
				uuid: recipient.uuid,
				input: amount,
				output: 0,
				balance: recipient.currentBalance,
				description: `Transferência recebida de ${client.fullName}.`
			});

			return response.accepted({ message: 'Pix enviado com sucesso!' });
		} catch {
			return response.badRequest({ message: 'Não foi possível enviar o pix.' });
		}
	}

	public async deposit({ request, response }: HttpContextContract) {
		try {
			const { recipient_cpf, amount } = await request.validate(DepositValidator);
			const client = await Client.findByOrFail('cpf_number', recipient_cpf);

			client.currentBalance = client.currentBalance + amount;
			await client.save();


			Event.emit('bank:extract', {
				uuid: client.uuid,
				input: amount,
				output: 0,
				balance: client.currentBalance,
				description: 'Deposito recebido.'
			});

			return response.ok({ message: 'Quantia depositada com sucesso!' });
		} catch {
			return response.badRequest({ message: 'Não foi possível realizar o depósito.' });
		}
	}

	public async withdraw({ auth, request, response }: HttpContextContract) {
		try {
			const { amount } = await request.validate(WithdrawValidator);
			const client = await Client.findByOrFail('uuid', auth.user!.uuid);

			if (client.currentBalance < amount) {
				return response.notAcceptable({ message: 'Saldo insuficiente!' });
			}

			client.currentBalance = client.currentBalance - amount;
			await client.save();


			Event.emit('bank:extract', {
				uuid: client.uuid,
				input: 0,
				output: amount,
				balance: client.currentBalance,
				description: 'Saque realizado.'
			});

			return response.ok({ message: 'Saque realizado com sucesso!' });
		} catch {
			return response.badRequest({ message: 'Não foi possível realizar o saque.' });
		}
	}

	public async extracts({ request, response }: HttpContextContract) {
		try {
			const { ...inputs } = request.qs();
			const extracts = await Client.query().preload('extracts').filter(inputs);
			return response.ok({ extracts });
		} catch {
			return response.badRequest({ message: 'Não foi possível listar os extratos' });
		}
	}
}
