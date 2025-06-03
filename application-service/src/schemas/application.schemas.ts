import { z } from "zod"

export const createApplicationSchema = z.object({
  body: z.object({
    collegeId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid college ID"),
    programId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid program ID"),
    applicationDeadline: z.string().datetime(),
    personalStatement: z.string().min(100, "Personal statement must be at least 100 characters").max(5000),
    academicHistory: z.object({
      gpa: z.number().min(0).max(4),
      satScore: z.number().min(400).max(1600).optional(),
      actScore: z.number().min(1).max(36).optional(),
      toeflScore: z.number().min(0).max(120).optional(),
      ieltsScore: z.number().min(0).max(9).optional(),
      transcripts: z.array(
        z.object({
          institution: z.string().min(1),
          fileUrl: z.string().url(),
          uploadedAt: z.string().datetime(),
        }),
      ),
    }),
    extracurricularActivities: z
      .array(
        z.object({
          activity: z.string().min(1),
          role: z.string().optional(),
          duration: z.string().optional(),
          description: z.string().max(500).optional(),
        }),
      )
      .optional(),
    workExperience: z
      .array(
        z.object({
          company: z.string().min(1),
          position: z.string().min(1),
          startDate: z.string().datetime(),
          endDate: z.string().datetime().optional(),
          description: z.string().max(500).optional(),
        }),
      )
      .optional(),
    recommendationLetters: z
      .array(
        z.object({
          recommenderName: z.string().min(1),
          recommenderEmail: z.string().email(),
          recommenderTitle: z.string().optional(),
          fileUrl: z.string().url().optional(),
          status: z.enum(["pending", "submitted", "received"]).default("pending"),
        }),
      )
      .optional(),
    essays: z
      .array(
        z.object({
          prompt: z.string().min(1),
          response: z.string().min(50).max(2000),
          wordCount: z.number().min(1),
        }),
      )
      .optional(),
    documents: z
      .array(
        z.object({
          type: z.enum(["transcript", "recommendation", "essay", "resume", "portfolio", "other"]),
          name: z.string().min(1),
          fileUrl: z.string().url(),
          uploadedAt: z.string().datetime(),
        }),
      )
      .optional(),
  }),
})

export const updateApplicationSchema = z.object({
  body: createApplicationSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID"),
  }),
})

export const submitApplicationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID"),
  }),
})

export const applicationStatusSchema = z.object({
  body: z.object({
    status: z.enum(["draft", "submitted", "under_review", "accepted", "rejected", "waitlisted"]),
    statusMessage: z.string().max(500).optional(),
    reviewedBy: z.string().optional(),
    reviewedAt: z.string().datetime().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID"),
  }),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>
export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>
export type ApplicationStatusInput = z.infer<typeof applicationStatusSchema>
