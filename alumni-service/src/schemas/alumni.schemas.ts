import { z } from "zod"

export const createAlumniSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email format"),
  graduationYear: z.number().int().min(1950).max(new Date().getFullYear()),
  degree: z.string().min(1, "Degree is required"),
  college: z.string().min(1, "College is required"),
  currentPosition: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(1000, "Bio too long").optional(),
  skills: z.array(z.string()).default([]),
  linkedinProfile: z.string().url("Invalid LinkedIn URL").optional(),
  isAvailableForMentoring: z.boolean().default(false),
})

export const updateAlumniSchema = createAlumniSchema.partial()

export const alumniParamsSchema = z.object({
  alumniId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid alumni ID"),
})

export const alumniQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).optional(),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
  college: z.string().optional(),
  graduationYear: z.string().transform(Number).pipe(z.number().int()).optional(),
  skills: z
    .string()
    .transform((val) => val.split(","))
    .optional(),
  isAvailableForMentoring: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  search: z.string().optional(),
})

export type CreateAlumniInput = z.infer<typeof createAlumniSchema>
export type UpdateAlumniInput = z.infer<typeof updateAlumniSchema>
export type AlumniParams = z.infer<typeof alumniParamsSchema>
export type AlumniQuery = z.infer<typeof alumniQuerySchema>
