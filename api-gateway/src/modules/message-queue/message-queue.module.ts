import { Module } from "@nestjs/common"
import { MessageQueueController } from "./message-queue.controller"
import { MessageQueueService } from "./message-queue.service"
import { KafkaModule } from "./kafka/kafka.module"

@Module({
  imports: [KafkaModule],
  controllers: [MessageQueueController],
  providers: [MessageQueueService],
})
export class MessageQueueModule {}
