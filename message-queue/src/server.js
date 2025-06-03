require('dotenv').config();
const amqp = require('amqplib');
const express = require('express');
const winston = require('winston');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'message-queue' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

 
const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to RabbitMQ
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    logger.info('Connected to RabbitMQ');
    return connection;
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
}

connectRabbitMQ();

// Start server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  logger.info(`message-queue service running on port ${PORT}`);
});

module.exports = app;
