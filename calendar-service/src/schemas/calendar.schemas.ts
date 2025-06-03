import { z } from "zod"

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(1000).optional(),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date"),
    location: z.string().max(500).optional(),
    type: z.enum(["deadline", "interview", "exam", "meeting", "reminder", "other"]),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    isAllDay: z.boolean().default(false),
    recurrence: z
      .object({
        frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
        interval: z.number().min(1).max(365).default(1),
        endDate: z.string().datetime().optional(),
        count: z.number().min(1).optional(),
      })
      .optional(),
    attendees: z
      .array(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          status: z.enum(["pending", "accepted", "declined"]).default("pending"),
        }),
      )
      .optional(),
    reminders: z
      .array(
        z.object({
          type: z.enum(["email", "sms", "push"]),
          minutesBefore: z.number().min(0).max(10080), // Max 1 week
        }),
      )
      .optional(),
    metadata: z.record(z.string(), z.any()).optional(),
    applicationId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    collegeId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
  }),
})

export const updateEventSchema = z.object({
  body: createEventSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid event ID"),
  }),
})

export const createReminderSchema = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid event ID"),
    type: z.enum(["email", "sms", "push"]),
    minutesBefore: z.number().min(0).max(10080),
    message: z.string().max(500).optional(),
    isActive: z.boolean().default(true),
  }),
})

export const getEventsSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    type: z.enum(["deadline", "interview", "exam", "meeting", "reminder", "other"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    page: z.string().transform(Number).default("1"),
    limit: z.string().transform(Number).default("10"),
  }),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type CreateReminderInput = z.infer<typeof createReminderSchema>
export type GetEventsInput = z.infer<typeof getEventsSchema>
