import { Injectable } from "@nestjs/common"
import { KafkaService } from "./kafka/kafka.service"

@Injectable()
export class MessageQueueService {
  constructor(private readonly kafkaService: KafkaService) {}

  async sendMessage(topic: string, message: any) {
    await this.kafkaService.publishEvent(topic, message)
    return {
      success: true,
      message: "Message sent successfully",
      timestamp: new Date().toISOString(),
    }
  }
}
