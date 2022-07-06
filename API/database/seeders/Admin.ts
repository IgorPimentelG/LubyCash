import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Admin from 'App/Models/Admin';

export default class extends BaseSeeder {
	public async run () {
		await Admin.updateOrCreateMany('email', [
			{
				fullName: 'Luby Cash Admin',
				email: 'admin@lubycash.com',
				password: 'secret'
			}
		]);
	}
}
