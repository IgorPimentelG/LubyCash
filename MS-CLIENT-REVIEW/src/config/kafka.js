const { Kafka } = require('kafkajs');

const kafka = new Kafka({
	clientId: 'ms-client-review-app',
	brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'ms-client-review-group' });
const producer = kafka.producer();

module.exports = {
	consumer,
	producer
};
