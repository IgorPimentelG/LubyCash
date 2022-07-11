import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'clients_addresses';

	public async up () {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn('address');
			table.string('street').notNullable();
			table.string('state', 2).alter();
			table.string('zipcode', 9).alter();
		});
	}

	public async down () {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('state');
			table.string('zipcode');
		});
	}
}
