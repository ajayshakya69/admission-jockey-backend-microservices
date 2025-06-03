const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function consumeEvents(queue, onMessage) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        onMessage(content);
        channel.ack(msg);
      }
    });
    console.log(`Waiting for messages in queue ${queue}`);
  } catch (error) {
    console.error('Error consuming events:', error);
  }
}

module.exports = { consumeEvents };
