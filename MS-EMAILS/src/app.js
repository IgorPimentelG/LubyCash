const app = require('express')();
const nodemailer = require('nodemailer');
const configEmail = require('./mail');
const consumer = require('./kafka');

const PORT = 3001;

async function run() {
	await consumer.connect();
	await consumer.subscribe({ topic: 'ms-emails'});
	await consumer.run({
		eachMessage: async ({ message }) => {
			const { to, subject, text } = JSON.parse(message.value.toString()).data;
			sendEmail(to, subject, text);
		}
	});
}

async function sendEmail(to, subject, text) {
	const transporter = nodemailer.createTransport(configEmail);
	await transporter.sendMail({
		from: 'no-replay@lubycash.com',
		to,
		subject,
		text
	});
}

app.listen(PORT);
run();
