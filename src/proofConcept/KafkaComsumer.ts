import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

export async function startConsumer(): Promise<void> {
    const kafka: Kafka = new Kafka({
        clientId: 'my-consumer',
        brokers: ['localhost:9094'],
    });

    const consumer: Consumer = kafka.consumer({ groupId: 'test-group' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
            console.log(`Received message: ${message.value?.toString()}`);
            
            // Simulate message processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log(`Processing completed ${message.value?.toString()}`);
        },
    });
}
