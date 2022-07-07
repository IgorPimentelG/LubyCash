/**
 * Config source: https://git.io/JY0mp
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { AuthConfig } from '@ioc:Adonis/Addons/Auth';

/*
|--------------------------------------------------------------------------
| Authentication Mapping
|--------------------------------------------------------------------------
|
| List of available authentication mapping. You must first define them
| inside the `contracts/auth.ts` file before mentioning them here.
|
*/
const authConfig: AuthConfig = {
	guard: 'admin_api',
	guards: {
		admin_api: {
			driver: 'oat',
			tokenProvider: {
				type: 'api',
				driver: 'database',
				table: 'admin_api_tokens',
				foreignKey: 'admin_uuid',
			},

			provider: {
				driver: 'lucid',
				identifierKey: 'uuid',
				uids: ['email'],
				model: () => import('App/Models/Admin'),
			},
		},

		client_api: {
			driver: 'oat',
			tokenProvider: {
				type: 'api',
				driver: 'database',
				table: 'client_api_tokens',
				foreignKey: 'client_uuid',
			},

			provider: {
				driver: 'lucid',
				identifierKey: 'uuid',
				uids: ['email'],
				model: () => import('App/Models/Client'),
			},
		},
	},
};

export default authConfig;
