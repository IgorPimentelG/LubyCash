import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Client from './Client';

export default class Extract extends BaseModel {
  @column({ isPrimary: true })
	public id: number;

  @column()
  public input: number;

  @column()
  public output: number;

  @column()
  public balance: number;

  @column()
  public client_uuid: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @belongsTo(() => Client)
  public user: BelongsTo<typeof Client>;
}
