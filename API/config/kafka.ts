import { Kafka } from 'kafkajs';

const kafka = new Kafka({
	clientId: 'api-app',
	brokers: ['localhost:9092']
});

const producer = kafka.producer();

export { producer };
