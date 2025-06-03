const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function publishEvent(queue, message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message sent to queue ${queue}:`, message);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error publishing event:', error);
  }
}

module.exports = { publishEvent };
