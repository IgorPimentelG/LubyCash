import Event from '@ioc:Adonis/Core/Event';
import Client from 'App/Models/Client';
import Extract from 'App/Models/Extract';
import { producer } from 'Config/kafka';
import { ClientRegisterEvent, ForgotPasswordEvent, ExtractEvent } from 'shared/model/types/events';

Event.on('client:register', async (payload: ClientRegisterEvent) => {

	const { uuid, email, firstName } = payload;

	await producer.connect();
	await producer.send({
		topic: 'ms-client-review',
		messages: [{
			value: JSON.stringify({ client_uuid: uuid })
		}]
	});

	await producer.send({
		topic: 'ms-emails',
		messages: [{
			value: JSON.stringify({
				to: email,
				subject: 'Luby Cash - Seja Bem Vindo',
				clientName: firstName,
				template: 'client_status',
				data: 'Sua conta na Luby Cash está em análise. Iremos lhe avisar quando tivemos um resultado.'
			})
		}]
	});

	await producer.disconnect();
});

Event.on('user:forgot-password', async (payload: ForgotPasswordEvent) => {
	const { email, firstName, token } = payload;

	await producer.connect();
	await producer.send({
		topic: 'ms-emails',
		messages: [{
			value: JSON.stringify({
				to: email,
				subject: 'Luby Cash - Recuperação de Conta',
				clientName: firstName,
				data: token,
				template: 'forgot_password'
			})
		}]
	});
	await producer.disconnect();
});

Event.on('bank:extract', async (payload: ExtractEvent) => {
	const { uuid, input, output, balance, description } = payload;

	const client = await Client.findBy('uuid', uuid);
	await client?.related('extracts').create({
		input,
		output,
		balance,
		description
	});
});
