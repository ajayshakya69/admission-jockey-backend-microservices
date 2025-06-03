import { z } from "zod"

export const createCollegeSchema = z.object({
  body: z.object({
    name: z.string().min(1, "College name is required").max(200),
    description: z.string().max(2000).optional(),
    location: z.object({
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zipCode: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
      coordinates: z
        .object({
          latitude: z.number().min(-90).max(90),
          longitude: z.number().min(-180).max(180),
        })
        .optional(),
    }),
    type: z.enum(["public", "private", "community"]),
    establishedYear: z.number().min(1600).max(new Date().getFullYear()),
    accreditation: z.array(z.string()).optional(),
    rankings: z
      .object({
        national: z.number().min(1).optional(),
        global: z.number().min(1).optional(),
        byMajor: z.record(z.string(), z.number().min(1)).optional(),
      })
      .optional(),
    admissionRequirements: z
      .object({
        gpaMinimum: z.number().min(0).max(4).optional(),
        satRange: z
          .object({
            min: z.number().min(400).max(1600),
            max: z.number().min(400).max(1600),
          })
          .optional(),
        actRange: z
          .object({
            min: z.number().min(1).max(36),
            max: z.number().min(1).max(36),
          })
          .optional(),
        toeflMinimum: z.number().min(0).max(120).optional(),
        ieltsMinimum: z.number().min(0).max(9).optional(),
        applicationDeadlines: z
          .object({
            earlyDecision: z.string().datetime().optional(),
            earlyAction: z.string().datetime().optional(),
            regular: z.string().datetime().optional(),
          })
          .optional(),
      })
      .optional(),
    tuition: z
      .object({
        inState: z.number().min(0).optional(),
        outOfState: z.number().min(0).optional(),
        international: z.number().min(0).optional(),
        roomAndBoard: z.number().min(0).optional(),
      })
      .optional(),
    programs: z
      .array(
        z.object({
          name: z.string().min(1),
          degree: z.enum(["associate", "bachelor", "master", "doctoral"]),
          duration: z.number().min(1).max(8),
          credits: z.number().min(1).optional(),
        }),
      )
      .optional(),
    facilities: z.array(z.string()).optional(),
    studentLife: z
      .object({
        totalStudents: z.number().min(0).optional(),
        internationalStudents: z.number().min(0).optional(),
        studentToFacultyRatio: z.string().optional(),
        campusSize: z.string().optional(),
      })
      .optional(),
    contactInfo: z
      .object({
        website: z.string().url().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        admissionsOffice: z
          .object({
            phone: z.string().optional(),
            email: z.string().email().optional(),
          })
          .optional(),
      })
      .optional(),
    images: z.array(z.string().url()).optional(),
    isActive: z.boolean().default(true),
  }),
})

export const updateCollegeSchema = z.object({
  body: createCollegeSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid college ID"),
  }),
})

export const searchCollegesSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
    type: z.enum(["public", "private", "community"]).optional(),
    minTuition: z.string().transform(Number).optional(),
    maxTuition: z.string().transform(Number).optional(),
    programs: z.string().optional(),
    page: z.string().transform(Number).default("1"),
    limit: z.string().transform(Number).default("10"),
    sortBy: z.enum(["name", "tuition", "ranking", "createdAt"]).default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
  }),
})

export type CreateCollegeInput = z.infer<typeof createCollegeSchema>
export type UpdateCollegeInput = z.infer<typeof updateCollegeSchema>
export type SearchCollegesInput = z.infer<typeof searchCollegesSchema>
