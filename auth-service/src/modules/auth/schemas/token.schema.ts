import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type TokenDocument = Token & Document

@Schema({ timestamps: true })
export class Token {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  token: string

  @Prop({ default: Date.now, expires: 604800 }) // 7 days
  createdAt: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token)
