import Address from './Address';
import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { Status } from '../../shared/model/enum/status';
import { BaseModel, beforeCreate, beforeSave, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm';

export default class Client extends BaseModel {
  @column({ isPrimary: true })
	public uuid: string;

  @column()
  public cpfNumber: string;

  @column()
  public fullName: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public phone: string;

  @column()
  public currentBalance: number;

  @column()
  public averageSalary: number;

  @column()
  public status: Status;

  @column()
  public addressId: number;

  @hasOne(() => Address, {
  	foreignKey: 'addressId'
  })
  public address: HasOne<typeof Address>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async setUUID(client: Client) {
  	client.uuid = uuidv4();
  }

  @beforeSave()
  public static async hashPassword(client: Client) {
  	if (client.$dirty.password) {
  		client.password = await Hash.make(client.password);
  	}
  }
}
