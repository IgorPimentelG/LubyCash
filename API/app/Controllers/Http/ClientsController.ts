import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Address from 'App/Models/Address';
import Client from 'App/Models/Client';
import StoreValidator from 'App/Validators/Client/StoreValidator';
import Event from '@ioc:Adonis/Core/Event';

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

			Event.emit('user:forgot-password', {
				email: email,
				fisrtName: full_name.split(' ')[0],
				uuid: client.uuid
			});

			return response.ok({ message: 'Você receberá um e-mail informando sua avaliação!' });
		} catch(error) {
			return response.badRequest({ message: 'Não foi possível solicitar o cadastro!', error });
		}
	}

	public async index({ response }: HttpContextContract) {
		try {
			const clients = await Client.all();
			return response.ok({ clients });
		} catch {
			return response.badRequest({ message: 'Não foi possível listar os clientes. '});
		}
	}
}
