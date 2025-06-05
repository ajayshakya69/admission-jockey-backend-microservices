import type { Document } from "mongoose"

export interface IUser extends Document {
  _id: string
  email: string
  password: string
  name: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IToken extends Document {
  _id: string
  userId: string
  token: string
  createdAt: Date
}

export interface JWTPayload {
  userId: string
  iat?: number
  exp?: number
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    verified: boolean
  }
}
