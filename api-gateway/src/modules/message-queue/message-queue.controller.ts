import { Controller, Post, Body, UseGuards } from "@nestjs/common"
import { MessageQueueService } from "./message-queue.service"
import { AuthGuard } from "../../guards/auth.guard"
import type { SendMessageDto } from "./dto/send-message.dto"

@Controller("message-queue")
@UseGuards(AuthGuard)
export class MessageQueueController {
  constructor(private readonly messageQueueService: MessageQueueService) {}

  @Post("send")
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messageQueueService.sendMessage(sendMessageDto.topic, sendMessageDto.message);
  }
}
