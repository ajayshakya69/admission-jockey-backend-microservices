import { z } from "zod"

export const createNotificationSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
    title: z.string().min(1, "Title is required").max(200),
    message: z.string().min(1, "Message is required").max(1000),
    type: z.enum(["info", "success", "warning", "error", "reminder"]),
    category: z.enum(["application", "payment", "deadline", "system", "marketing"]),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    channels: z.array(z.enum(["email", "sms", "push", "in_app"])).min(1, "At least one channel is required"),
    scheduledFor: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    actionUrl: z.string().url().optional(),
    actionText: z.string().max(50).optional(),
  }),
})

export const updateNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    message: z.string().min(1).max(1000).optional(),
    type: z.enum(["info", "success", "warning", "error", "reminder"]).optional(),
    category: z.enum(["application", "payment", "deadline", "system", "marketing"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    channels: z.array(z.enum(["email", "sms", "push", "in_app"])).optional(),
    scheduledFor: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    actionUrl: z.string().url().optional(),
    actionText: z.string().max(50).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid notification ID"),
  }),
})

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid notification ID"),
  }),
})

export const bulkNotificationSchema = z.object({
  body: z.object({
    userIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1, "At least one user ID is required"),
    title: z.string().min(1, "Title is required").max(200),
    message: z.string().min(1, "Message is required").max(1000),
    type: z.enum(["info", "success", "warning", "error", "reminder"]),
    category: z.enum(["application", "payment", "deadline", "system", "marketing"]),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    channels: z.array(z.enum(["email", "sms", "push", "in_app"])).min(1, "At least one channel is required"),
    scheduledFor: z.string().datetime().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
})

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>
export type MarkAsReadInput = z.infer<typeof markAsReadSchema>
export type BulkNotificationInput = z.infer<typeof bulkNotificationSchema>
