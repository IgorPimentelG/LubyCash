import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'extracts';

	public async up () {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary();
			table.float('input').unsigned().notNullable();
			table.float('output').unsigned().notNullable();
			table.float('balance').unsigned().notNullable();
			table.text('description').notNullable();
			table
				.uuid('client_uuid')
				.references('uuid')
				.inTable('clients')
				.notNullable();
			table.timestamp('created_at', { useTz: true });
		});
	}

	public async down () {
		this.schema.dropTable(this.tableName);
	}
}
