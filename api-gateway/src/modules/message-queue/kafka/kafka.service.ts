import { Injectable, Logger, type OnModuleDestroy } from "@nestjs/common"
import { Kafka, type Producer } from "kafkajs"

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name)
  private readonly kafka: Kafka
  private producer: Producer

  constructor() {
    this.kafka = new Kafka({
      clientId: "api-gateway",
      brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
    })
    this.producer = this.kafka.producer()
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect()
      this.logger.log("✅ Connected to Kafka")
    } catch (error) {
      this.logger.error("❌ Failed to connect to Kafka", error)
      throw error
    }
  }

  async publishEvent(topic: string, message: Record<string, any>): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      })
      this.logger.log(`📤 Message published to topic: ${topic}`)
    } catch (error) {
      this.logger.error(`❌ Failed to publish message to topic: ${topic}`, error)
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect()
      this.logger.log("✅ Kafka producer disconnected")
    } catch (error) {
      this.logger.error("❌ Error disconnecting Kafka producer", error)
    }
  }
}
