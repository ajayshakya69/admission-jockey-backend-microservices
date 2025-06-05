import { IsString, IsNotEmpty, IsObject } from "class-validator"

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  topic: string

  @IsObject()
  @IsNotEmpty()
  message: any
}
