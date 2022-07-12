import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter';
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';
import Client from 'App/Models/Client';

export default class ClientFilter extends BaseModelFilter {
	public $query: ModelQueryBuilderContract<typeof Client, Client>;

	status(value: string) {
		this.$query.where('status', 'LIKE', `%${value}%`);
	}

	createdAt(date: string) {
		this.$query.whereBetween('created_at', [date[0], date[1]]);
	}
}
