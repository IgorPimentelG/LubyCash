import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'clients';

	public async up () {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('uuid').primary();
			table.string('cpf_number').unique().notNullable();
			table.string('full_name').notNullable();
			table.string('email').unique().notNullable();
			table.string('password').notNullable();
			table.string('phone').unique().notNullable();
			table.float('current_balance').defaultTo(0);
			table.float('average_salary').defaultTo(0);
			table.enum('status', ['approved', 'disapproved', 'analysis']).defaultTo('analysis');
			table.integer('address_id').unsigned().references('id').inTable('clients_addresses').notNullable();
			table.timestamp('created_at', { useTz: true });
			table.timestamp('updated_at', { useTz: true });
		});
	}

	public async down () {
		this.schema.dropTable(this.tableName);
	}
}
