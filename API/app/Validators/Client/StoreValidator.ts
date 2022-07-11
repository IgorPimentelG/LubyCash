import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class StoreValidator {
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
		cpf_number: schema.string({}, [
			rules.required(),
			rules.regex(/(\d{3}).(\d{3}).(\d{3})-(\d{2})/g),
			rules.unique({ table: 'clients', column: 'cpf_number'})
		]),
		full_name: schema.string({}, [
			rules.required(),
			rules.trim(),
			rules.minLength(5),
			rules.maxLength(150),
			rules.unique({ table: 'clients', column: 'full_name' })
		]),
		email: schema.string({}, [
			rules.required(),
			rules.email(),
			rules.unique({ table: 'clients', column: 'email' })
		]),
		password: schema.string({}, [
			rules.required(),
			rules.trim(),
			rules.minLength(8),
			rules.maxLength(20)
		]),
		phone: schema.string({}, [
			rules.required(),
			rules.regex(/\((\d{2})\)\s(\d{5})-(\d{4})/g),
			rules.unique({ table: 'clients', column: 'phone' })
		]),
		average_salary: schema.number([
			rules.required(),
			rules.unsigned(),
		]),
		address: schema.object().members({
			street: schema.string({}, [
				rules.required(),
				rules.trim()
			]),
			city: schema.string({}, [
				rules.required(),
				rules.trim()
			]),
			state: schema.string({}, [
				rules.required(),
				rules.minLength(2),
				rules.maxLength(2)
			]),
			zipcode: schema.string({}, [
				rules.required(),
				rules.regex(/(\d{5})-(\d{3})/g)
			])
		})
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
	public messages: CustomMessages = {
		'cpf_number.regex': 'CPF Inválido! Informe no formato: xxx.xxx.xxx-xx',
		'cpf_number.required': 'Informe o CPF'
	};
}
