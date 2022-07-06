import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import Hash from '@ioc:Adonis/Core/Hash';
import { BaseModel, beforeCreate, beforeSave, column } from '@ioc:Adonis/Lucid/Orm';

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
	public uuid: string;

  @column()
  public fullName: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async setUUID(admin: Admin) {
  	admin.uuid = uuid();
  }

  @beforeSave()
  public static async hashPassword(admin: Admin) {
  	if (admin.$dirty.password) {
  		admin.password = await Hash.make(admin.password);
  	}
  }
}
