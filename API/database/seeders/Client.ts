import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Address from 'App/Models/Address';
import Client from 'App/Models/Client';

export default class extends BaseSeeder {
	public async run () {
		await Address.updateOrCreateMany('zipcode',[
			{
				id: 1,
				street: 'Cataratas do Iguaçu',
				city: 'Manaus',
				state: 'AM',
				zipcode: '69098448'
			}
		]);

		await Client.updateOrCreateMany('email', [
			{
				cpfNumber: '05320276044',
				fullName: 'Larissa Ester Silvana da Silva',
				email: 'user@lubycash.com',
				password: 'secret',
				phone: '92996816769',
				averageSalary: 1.200,
				addressId: 1
			}
		]);
	}
}
