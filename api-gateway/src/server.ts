import "dotenv/config"
import express, { type Request, type Response, type NextFunction } from "express"
import axios from "axios"
import { serviceDiscovery } from "./services/serviceDiscovery"
import { messageQueueService } from "./services/messageQueue.service"
import { corsMiddleware } from "./middlewares/cors.middleware"
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware"
import { loggingMiddleware } from "./middlewares/logging.middleware"
import { authMiddleware } from "./middlewares/auth.middleware"
import { logger } from "./utils/logger"
import type { HealthCheck } from "./schemas/common.schemas"
import messageQueueRoutes from "./routes/messageQueue.routes"

const app = express()

// Middleware
app.use(corsMiddleware)
app.use(rateLimitMiddleware)
app.use(loggingMiddleware)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req: Request, res: Response<HealthCheck>): void => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "api-gateway",
  })
})

// Message queue routes
app.use("/message-queue", messageQueueRoutes)

// Dynamic proxy middleware
async function proxyRequest(req: Request, res: Response, serviceName: string): Promise<void> {
  try {
    const instances = await serviceDiscovery.getServiceInstances(serviceName)

    if (instances.length === 0) {
      res.status(503).json({
        message: `${serviceName} service unavailable`,
        statusCode: 503,
        timestamp: new Date().toISOString(),
      })
      return
    }

    // Simple round-robin load balancing
    const instance = instances[Math.floor(Math.random() * instances.length)]
    const targetUrl = `http://${instance.address}:${instance.port}${req.originalUrl}`

    const response = await axios({
      method: req.method as any,
      url: targetUrl,
      headers: { ...req.headers, host: undefined },
      data: req.body,
      timeout: 30000,
      validateStatus: () => true,
    })

    // Forward response headers
    Object.keys(response.headers).forEach((key) => {
      if (key !== "transfer-encoding") {
        res.set(key, response.headers[key])
      }
    })

    res.status(response.status).send(response.data)
  } catch (error) {
    logger.error("Proxy request failed:", {
      serviceName,
      error: error instanceof Error ? error.message : "Unknown error",
      url: req.originalUrl,
    })

    res.status(500).json({
      message: "Service temporarily unavailable",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    })
  }
}

// Service routes
app.use("/auth", (req, res) => proxyRequest(req, res, "auth-service"))
app.use("/users", authMiddleware, (req, res) => proxyRequest(req, res, "user-service"))
app.use("/colleges", (req, res) => proxyRequest(req, res, "college-service"))
app.use("/applications", authMiddleware, (req, res) => proxyRequest(req, res, "application-service"))
app.use("/alumni", (req, res) => proxyRequest(req, res, "alumni-service"))
app.use("/calendar", authMiddleware, (req, res) => proxyRequest(req, res, "calendar-service"))
app.use("/payments", authMiddleware, (req, res) => proxyRequest(req, res, "payment-service"))
app.use("/notifications", authMiddleware, (req, res) => proxyRequest(req, res, "notification-service"))

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error("Unhandled error:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
  })

  res.status(500).json({
    message: "Internal server error",
    statusCode: 500,
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use("*", (req: Request, res: Response): void => {
  res.status(404).json({
    message: "Route not found",
    statusCode: 404,
    timestamp: new Date().toISOString(),
  })
})

// Start server
const PORT = Number.parseInt(process.env.PORT || "3000", 10)
const SERVICE_NAME = "api-gateway"
const SERVICE_ID = `${SERVICE_NAME}-${PORT}`
const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || "api-gateway"

const server = app.listen(PORT, "0.0.0.0", async () => {
  logger.info(`API Gateway running on port ${PORT}`)

  try {
    await messageQueueService.connect()
    await serviceDiscovery.registerService(SERVICE_NAME, SERVICE_ID, SERVICE_ADDRESS, PORT)
  } catch (error) {
    logger.error("Failed to initialize services:", error)
  }
})

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`)

  server.close(async () => {
    try {
      await serviceDiscovery.deregisterService(SERVICE_ID)
      await messageQueueService.close()
      logger.info("Server closed successfully")
      process.exit(0)
    } catch (error) {
      logger.error("Error during shutdown:", error)
      process.exit(1)
    }
  })
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))

export default app
