import amqp, { type Connection, type Channel } from "amqplib"
import { logger } from "../utils/logger"

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost"

export class MessageQueueService {
  private connection: Connection | null = null
  private channel: Channel | null = null

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(RABBITMQ_URL)
      this.channel = await this.connection.createChannel()
      logger.info("Connected to RabbitMQ")
    } catch (error) {
      logger.error("Failed to connect to RabbitMQ:", error)
      throw error
    }
  }

  async publishEvent(queue: string, message: Record<string, any>): Promise<void> {
    if (!this.channel) {
      await this.connect()
    }

    try {
      await this.channel!.assertQueue(queue, { durable: true })
      this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true })
      logger.info("Message published to queue", { queue, message })
    } catch (error) {
      logger.error("Error publishing event:", error)
      throw error
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close()
      }
      if (this.connection) {
        await this.connection.close()
      }
      logger.info("RabbitMQ connection closed")
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error)
    }
  }
}

export const messageQueueService = new MessageQueueService()
