import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Address from 'App/Models/Address';
import Client from 'App/Models/Client';
import StoreValidator from 'App/Validators/Client/StoreValidator';
import { producer } from 'Config/kafka';

export default class ClientsController {
	public async store({ request, response }: HttpContextContract) {
		try {
			const {
				full_name,
				email,
				cpf_number,
				password,
				phone,
				average_salary,
				address
			} = await request.validate(StoreValidator);

			const fisrtName = full_name.split(' ')[0];
			const client_address = await Address.create(address);
			const client = await Client.create({
				fullName: full_name,
				cpfNumber: cpf_number,
				averageSalary: average_salary,
				email,
				password,
				phone,
				addressId: client_address.id
			});

			await producer.connect();
			await producer.send({
				topic: 'ms-client-review',
				messages: [{
					value: JSON.stringify({ client_uuid: client.uuid })
				}]
			});
			await producer.send({
				topic: 'ms-emails',
				messages: [{
					value: JSON.stringify({
						to: email,
						subject: 'Luby Cash - Seja Bem Vindo',
						text:
              `Olá ${fisrtName}, \n\nSua conta na Luby Cash está em análise. Iremos lhe avisar quando tivemos um resultado.`
					})
				}]
			});
			await producer.disconnect();

			return response.ok({ message: 'Você receberá um e-mail informando sua avaliação!' });
		} catch(error) {
			return response.badRequest({ message: 'Não foi possível solicitar o cadastro!', error });
		}
	}
}
