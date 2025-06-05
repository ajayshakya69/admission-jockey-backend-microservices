import { z } from "zod"

export const HealthCheckSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  service: z.string(),
})

export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
  statusCode: z.number(),
  timestamp: z.string(),
})

export const ServiceInstanceSchema = z.object({
  address: z.string(),
  port: z.number(),
})

export const MessageQueueEventSchema = z.object({
  queue: z.string().min(1, "Queue name is required"),
  message: z.record(z.any()),
})

export type HealthCheck = z.infer<typeof HealthCheckSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type ServiceInstance = z.infer<typeof ServiceInstanceSchema>
export type MessageQueueEvent = z.infer<typeof MessageQueueEventSchema>
