import { Kafka } from "kafkajs"
import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

const kafka = new Kafka({
    clientId: "consumer",
    brokers: [process.env.KAFKA_BROKER]
})

const consumer = kafka.consumer({ groupId: "records-group" })

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

async function run() {

    await consumer.connect()

    await consumer.subscribe({
        topic: process.env.KAFKA_TOPIC,
        fromBeginning: true
    })

    await consumer.run({

        eachMessage: async ({ message }) => {

            const data = JSON.parse(message.value.toString());

            console.log("Event received:", data);

            if (data.records) {

                await redis.set(
                    "records:all",
                    JSON.stringify(data.records)
                );

                console.log("Redis cache updated");

            }

        }

    });

}

run().catch(console.error)