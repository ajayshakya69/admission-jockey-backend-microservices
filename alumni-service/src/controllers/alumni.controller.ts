import type { Request, Response, NextFunction } from "express"
import type { ServiceResponse } from "@/types/global"
import type { IAlumni } from "@/types/alumni.types"
import type { CreateAlumniInput, UpdateAlumniInput, AlumniParams, AlumniQuery } from "@/schemas/alumni.schemas"
import { Alumni } from "@/models/alumni.model"
import { NotFoundError, ConflictError, DatabaseError } from "@/utils/errors"
import { asyncHandler } from "@/middlewares/errorHandler"
import { logger } from "@/utils/logger"

export const getAlumni = asyncHandler(
  async (
    req: Request<{}, ServiceResponse<IAlumni[]>, {}, AlumniQuery>,
    res: Response<ServiceResponse<IAlumni[]>>,
    next: NextFunction,
  ): Promise<void> => {
    const { page = 1, limit = 10, college, graduationYear, skills, isAvailableForMentoring, search } = req.query

    // Build query
    const query: any = {}

    if (college) query.college = new RegExp(college, "i")
    if (graduationYear) query.graduationYear = graduationYear
    if (skills && skills.length > 0) query.skills = { $in: skills }
    if (typeof isAvailableForMentoring === "boolean") query.isAvailableForMentoring = isAvailableForMentoring
    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { bio: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
      ]
    }

    try {
      const skip = (page - 1) * limit

      const [alumni, total] = await Promise.all([
        Alumni.find(query).select("-connections").skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Alumni.countDocuments(query),
      ])

      const response: ServiceResponse<IAlumni[]> = {
        success: true,
        data: alumni,
        statusCode: 200,
        timestamp: new Date().toISOString(),
        message: `Found ${alumni.length} alumni`,
      }

      // Add pagination metadata
      ;(response as any).pagination = {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }

      logger.info("Alumni retrieved successfully", { count: alumni.length, query })
      res.status(200).json(response)
    } catch (error) {
      logger.error("Error retrieving alumni:", error)
      throw new DatabaseError("Failed to retrieve alumni")
    }
  },
)

export const getAlumnusById = asyncHandler(
  async (req: Request<AlumniParams>, res: Response<ServiceResponse<IAlumni>>, next: NextFunction): Promise<void> => {
    const { alumniId } = req.params

    try {
      const alumnus = await Alumni.findById(alumniId)
        .populate("connections", "name email currentPosition company")
        .lean()

      if (!alumnus) {
        throw new NotFoundError("Alumnus")
      }

      const response: ServiceResponse<IAlumni> = {
        success: true,
        data: alumnus,
        statusCode: 200,
        timestamp: new Date().toISOString(),
      }

      logger.info("Alumnus retrieved successfully", { alumniId })
      res.status(200).json(response)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error("Error retrieving alumnus:", error)
      throw new DatabaseError("Failed to retrieve alumnus")
    }
  },
)

export const createAlumnus = asyncHandler(
  async (
    req: Request<{}, ServiceResponse<IAlumni>, CreateAlumniInput>,
    res: Response<ServiceResponse<IAlumni>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Check if alumni already exists
      const existingAlumni = await Alumni.findOne({
        $or: [{ email: req.body.email }, { userId: req.body.userId }],
      })

      if (existingAlumni) {
        throw new ConflictError("Alumni with this email or user ID already exists")
      }

      const alumnus = new Alumni(req.body)
      await alumnus.save()

      const response: ServiceResponse<IAlumni> = {
        success: true,
        data: alumnus.toObject(),
        statusCode: 201,
        timestamp: new Date().toISOString(),
        message: "Alumnus created successfully",
      }

      logger.info("Alumnus created successfully", { alumniId: alumnus._id })
      res.status(201).json(response)
    } catch (error) {
      if (error instanceof ConflictError) throw error
      logger.error("Error creating alumnus:", error)
      throw new DatabaseError("Failed to create alumnus")
    }
  },
)

export const updateAlumnus = asyncHandler(
  async (
    req: Request<AlumniParams, ServiceResponse<IAlumni>, UpdateAlumniInput>,
    res: Response<ServiceResponse<IAlumni>>,
    next: NextFunction,
  ): Promise<void> => {
    const { alumniId } = req.params

    try {
      const alumnus = await Alumni.findByIdAndUpdate(
        alumniId,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true },
      ).lean()

      if (!alumnus) {
        throw new NotFoundError("Alumnus")
      }

      const response: ServiceResponse<IAlumni> = {
        success: true,
        data: alumnus,
        statusCode: 200,
        timestamp: new Date().toISOString(),
        message: "Alumnus updated successfully",
      }

      logger.info("Alumnus updated successfully", { alumniId })
      res.status(200).json(response)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error("Error updating alumnus:", error)
      throw new DatabaseError("Failed to update alumnus")
    }
  },
)

export const deleteAlumnus = asyncHandler(
  async (req: Request<AlumniParams>, res: Response<ServiceResponse<null>>, next: NextFunction): Promise<void> => {
    const { alumniId } = req.params

    try {
      const alumnus = await Alumni.findByIdAndDelete(alumniId)

      if (!alumnus) {
        throw new NotFoundError("Alumnus")
      }

      const response: ServiceResponse<null> = {
        success: true,
        data: null,
        statusCode: 200,
        timestamp: new Date().toISOString(),
        message: "Alumnus deleted successfully",
      }

      logger.info("Alumnus deleted successfully", { alumniId })
      res.status(200).json(response)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error("Error deleting alumnus:", error)
      throw new DatabaseError("Failed to delete alumnus")
    }
  },
)
