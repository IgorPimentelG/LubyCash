import Event from '@ioc:Adonis/Core/Event';
import { producer } from 'Config/kafka';
import { ClientRegisterEvent, ForgotPasswordEvent } from 'shared/model/types/events';

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
