import mongoose, { Schema } from "mongoose"
import type { IToken } from "../types"

const tokenSchema = new Schema<IToken>({
  userId: {
    type: String,
    required: true,
    ref: "User",
    index: true,
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Token expires after 7 days
  },
})

// Compound index for better query performance
tokenSchema.index({ userId: 1, token: 1 })

export const Token = mongoose.model<IToken>("Token", tokenSchema)
