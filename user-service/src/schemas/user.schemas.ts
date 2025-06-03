import { z } from "zod"

export const createProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email format"),
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, "Invalid phone number")
      .optional(),
    dateOfBirth: z.string().datetime().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    bio: z.string().max(500).optional(),
    profilePicture: z.string().url().optional(),
  }),
})

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/)
      .optional(),
    dateOfBirth: z.string().datetime().optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    bio: z.string().max(500).optional(),
    profilePicture: z.string().url().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  }),
})

export const educationSchema = z.object({
  body: z.object({
    institution: z.string().min(1, "Institution name is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    gpa: z.number().min(0).max(4).optional(),
    achievements: z.array(z.string()).optional(),
  }),
})

export const preferencesSchema = z.object({
  body: z.object({
    preferredColleges: z.array(z.string()).optional(),
    interestedMajors: z.array(z.string()).optional(),
    budgetRange: z
      .object({
        min: z.number().min(0),
        max: z.number().min(0),
      })
      .optional(),
    locationPreferences: z.array(z.string()).optional(),
    notifications: z
      .object({
        email: z.boolean().default(true),
        sms: z.boolean().default(false),
        push: z.boolean().default(true),
      })
      .optional(),
  }),
})

export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type EducationInput = z.infer<typeof educationSchema>
export type PreferencesInput = z.infer<typeof preferencesSchema>
