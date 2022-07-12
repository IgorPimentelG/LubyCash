import Client from 'App/Models/Client';
import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm';

export default class Address extends BaseModel {
	public static table = 'clients_addresses';

  @column({ isPrimary: true })
	public id: number;

  @column()
  public street: string;

  @column()
  public city: string;

  @column()
  public state: string;

  @column()
  public zipcode: string;

  @column()
  public client_uuid: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Client)
  public user: BelongsTo<typeof Client>;
}
