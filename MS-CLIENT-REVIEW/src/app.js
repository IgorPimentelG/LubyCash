const app = require('express')();
const routes = require('./routes');
const { consumer, producer } = require('./config/kafka');
const { findByUUID, updateStatus } = require('./database');

const PORT = 3002;

app.use(routes);

async function run() {
	await consumer.connect();
	await producer.connect();

	await consumer.subscribe({ topic: 'ms-client-review' });
	await consumer.run({
		eachMessage: async ({ message }) => {
			const { client_uuid } = JSON.parse(message.value.toString());
			const { user } = await findByUUID(client_uuid);
			const fisrtName = user.full_name.split(' ')[0];
			let status = 'disapproved';
			let bonus = 0;

			// Renda Mensal < 500 = Reprovado || Renda Mensal >= 500 = Aprovado.
			if (user.average_salary >= 500) {
				status = 'approved';
				bonus = 200.00;
			}

			await updateStatus(client_uuid, status, bonus);
			await producer.send({
				topic: 'ms-emails',
				messages: [{
					value: JSON.stringify({
						to: user.email,
						subject: 'Luby Cash - Resultado da sua avaliação',
						text:
							`Olá ${fisrtName}, \n\nSua conta na Luby Cash foi ${status === 'approved' ? 'aprovada :)' : 'reprovada :('}`
					})
				}]
			});
		}
	});
}

run();
app.listen(PORT);
