import type { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
    logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    })
  })

  next()
}
