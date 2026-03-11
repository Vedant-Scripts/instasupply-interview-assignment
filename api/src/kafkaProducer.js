import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();
const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER]
});

export const producer = kafka.producer();

export const sendEvent = async (payload) => {
    await producer.connect();

    await producer.send({
        topic: process.env.KAFKA_TOPIC,
        messages: [
            {
                value: JSON.stringify(payload)
            }
        ]
    });


    await producer.disconnect();
};