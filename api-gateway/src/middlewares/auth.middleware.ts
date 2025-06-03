import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    [key: string]: any
  }
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authorization header missing or malformed",
      statusCode: 401,
      timestamp: new Date().toISOString(),
    })
    return
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as any
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token",
      statusCode: 401,
      timestamp: new Date().toISOString(),
    })
  }
}
