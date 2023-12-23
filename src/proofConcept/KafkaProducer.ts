import { Kafka, Producer } from 'kafkajs';

export async function produceMessages(): Promise<void> {
    const kafka: Kafka = new Kafka({ brokers: ['localhost:9094'] });
    const producer: Producer = kafka.producer();

    await producer.connect();
    let messages = Array.from({ length: 10 }, (_, i) => ({
        key: 'yam01',
        value: `yam01 Message ${i + 1}`,
    }));

    await producer.send({
        topic: 'test-topic',
        messages,
    });

    messages = Array.from({ length: 10 }, (_, i) => ({
        key: 'yam02',
        value: `yam02 Message ${i + 1}`,
    }));

    await producer.send({
        topic: 'test-topic',
        messages,
    });

    await producer.disconnect();
}