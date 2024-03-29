import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'admins';

	public async up () {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid('uuid').primary();
			table.string('full_name').notNullable().unique();
			table.string('email').notNullable().unique();
			table.string('password').notNullable();
			table.timestamp('created_at', { useTz: true });
			table.timestamp('updated_at', { useTz: true });
		});
	}

	public async down () {
		this.schema.dropTable(this.tableName);
	}
}
