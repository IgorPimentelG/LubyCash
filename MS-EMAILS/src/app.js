const app = require('express')();
const nodemailer = require('nodemailer');
const configEmail = require('./mail');
const consumer = require('./kafka');
const hbs = require('nodemailer-express-handlebars');

const PORT = 3001;
const transporter = nodemailer.createTransport(configEmail);
transporter.use('compile', hbs({
	viewEngine: {
		partialsDir: 'src/views',
		defaultLayout: false,
	},
	viewPath: 'src/views',
}));

async function run() {
	await consumer.connect();
	await consumer.subscribe({ topic: 'ms-emails'});
	await consumer.run({
		eachMessage: async ({ message }) => {
			const { to, subject, clientName, data, template } = JSON.parse(message.value.toString());

			const templateConfig = {
				template,
				context: {
					clientName,
					data
				}
			};

			sendEmail(to, subject, templateConfig);
		}
	});
}

async function sendEmail(to, subject, template) {
	await transporter.sendMail({
		from: 'no-replay@lubycash.com',
		to,
		subject,
		...template
	}).catch((error) => console.log(error));
}

app.listen(PORT);
run();
