const { Kafka } = require('kafkajs');

const kafka = new Kafka({
	clientId: 'ms-email-app',
	brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'ms-emails-group' });

module.exports = consumer;
