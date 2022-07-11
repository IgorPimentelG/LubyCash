require('dotenv').config();

const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	database: process.env.MYSQL_DB_NAME,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD
});

module.exports = mysqlConnection;
