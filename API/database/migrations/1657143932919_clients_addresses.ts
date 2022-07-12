import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'clients_addresses';

	public async up () {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary();
			table.string('address').notNullable();
			table.string('city').notNullable();
			table.string('state').notNullable();
			table.string('zipcode').notNullable();
			table
				.uuid('client_uuid')
				.references('uuid')
				.inTable('clients')
				.onDelete('CASCADE');
			table.timestamp('created_at', { useTz: true });
			table.timestamp('updated_at', { useTz: true });
		});
	}

	public async down () {
		this.schema.dropTable(this.tableName);
	}
}
