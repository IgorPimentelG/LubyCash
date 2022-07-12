import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class ForgotPassword extends BaseModel {
	static table = 'forgot_password_tokens';

  @column({ isPrimary: true })
	public id: number;

  @column()
  public token: string;

  @column()
  public user_uuid: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
