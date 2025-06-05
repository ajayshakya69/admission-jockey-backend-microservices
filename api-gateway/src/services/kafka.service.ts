// kafkaClient.ts
import { Kafka, Producer } from "kafkajs";
import { logger } from "../utils/logger";

const kafka = new Kafka({
  clientId: "my-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

class KafkaService {
  private producer: Producer;

  constructor() {
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      logger.info("Connected to Kafka");
    } catch (error) {
      logger.error("Failed to connect to Kafka", error);
      throw error;
    }
  }

  async publishEvent(topic: string, message: Record<string, any>): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      logger.info("Message published to topic", { topic, message });
    } catch (error) {
      logger.error("Failed to publish message to topic", error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.producer.disconnect();
      logger.info("Kafka producer disconnected");
    } catch (error) {
      logger.error("Error disconnecting Kafka producer", error);
    }
  }
}

export const kafkaService = new KafkaService();
