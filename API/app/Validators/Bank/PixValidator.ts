import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class PixValidator {
	constructor(protected ctx: HttpContextContract) {}

	/*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
	public schema = schema.create({
		recipient_cpf: schema.string({}, [
			rules.required(),
			rules.regex(/(\d{3}).(\d{3}).(\d{3})-(\d{2})/g),
			rules.exists({ table: 'clients', column: 'cpf_number' }),
		]),
		amount: schema.number([
			rules.required(),
			rules.unsigned(),
			rules.range(1, 10000000)
		])
	});

	/**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
	public messages: CustomMessages = {};
}
