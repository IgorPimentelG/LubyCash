const mysql = require('../config/database');
const cpf = require('cpf');

function findByUUID(uuid) {
	return new Promise((resolve, reject) => {
		mysql.query(`SELECT full_name, email, status, average_salary FROM clients WHERE uuid = '${uuid}'`,
			(error, rows) => {
				if (error) {
					return reject();
				}

				return resolve({ user: JSON.parse(JSON.stringify(rows))[0] });
			});
	});
}

function findByStatus(cpf_number) {
	return new Promise((resolve, reject) => {
		mysql.query(`SELECT full_name, email, status FROM clients WHERE cpf_number = '${cpf.format(cpf_number)}'`,
			(error, rows) => {
				if (error) {
					return reject();
				}

				return resolve({ user: JSON.parse(JSON.stringify(rows))[0] });
			});
	});
}

function updateStatus(uuid, status, bonus) {
	return new Promise((resolve, reject) => {
		const datetime = new Date();
		mysql.query(`
			UPDATE clients SET
			current_balance = '${bonus}',
			status = '${status}',
			updated_at = '${datetime.toISOString()}'
			WHERE uuid = '${uuid}'
		`,
		(error) => {
			if (error) {
				return reject({ message: 'update' });
			}

			return resolve();
		});
	});
}

module.exports = {
	findByUUID,
	findByStatus,
	updateStatus
};
