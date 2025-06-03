import { Router } from "express"
import { getAlumni, getAlumnusById, createAlumnus, updateAlumnus, deleteAlumnus } from "@/controllers/alumni.controller"
import { validate } from "@/middlewares/validation"
import { createAlumniSchema, updateAlumniSchema, alumniParamsSchema, alumniQuerySchema } from "@/schemas/alumni.schemas"

const router = Router()

// Get all alumni with filtering and pagination
router.get("/", validate({ query: alumniQuerySchema }), getAlumni)

// Get alumnus by ID
router.get("/:alumniId", validate({ params: alumniParamsSchema }), getAlumnusById)

// Create new alumnus
router.post("/", validate({ body: createAlumniSchema }), createAlumnus)

// Update alumnus by ID
router.put(
  "/:alumniId",
  validate({
    params: alumniParamsSchema,
    body: updateAlumniSchema,
  }),
  updateAlumnus,
)

// Delete alumnus by ID
router.delete("/:alumniId", validate({ params: alumniParamsSchema }), deleteAlumnus)

export default router
