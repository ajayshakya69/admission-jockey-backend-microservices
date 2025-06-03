import type { Request, Response, NextFunction } from "express"
import { type ZodSchema, ZodError } from "zod"

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        })
      }
      next(error)
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Query validation error",
          errors: error.errors,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        })
      }
      next(error)
    }
  }
}

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Parameter validation error",
          errors: error.errors,
          statusCode: 400,
          timestamp: new Date().toISOString(),
        })
      }
      next(error)
    }
  }
}
