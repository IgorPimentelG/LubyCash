import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'clients';

	public async up () {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('cpf_number', 14).alter();
			table.string('phone', 16).alter();
		});
	}

	public async down () {
		this.schema.alterTable(this.tableName, (table) => {
			table.string('cpf_number');
			table.string('phone');
		});
	}
}
