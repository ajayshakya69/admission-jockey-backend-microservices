import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import { logger, logStream } from "@/utils/logger"
import { globalErrorHandler, notFoundHandler } from "@/middlewares/errorHandler"
import { DatabaseError } from "@/utils/errors"
import applicationRoutes from "@/routes/application.routes"
import type { ServiceHealth } from "@/types/global"
import morgan from "morgan"

const app = express()

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Logging middleware
app.use(morgan("combined", { stream: logStream }))

// Health check endpoint
app.get("/health", async (req, res): Promise<void> => {
  const health: ServiceHealth = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "application-service",
    version: process.env.SERVICE_VERSION || "1.0.0",
    uptime: process.uptime(),
    dependencies: {
      database: mongoose.connection.readyState === 1 ? "healthy" : "unhealthy",
    },
  }

  const statusCode = health.dependencies.database === "healthy" ? 200 : 503
  res.status(statusCode).json(health)
})

// Routes
app.use("/applications", applicationRoutes)

// Error handling middleware
app.use(notFoundHandler)
app.use(globalErrorHandler)

// Database connection
const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined")
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    logger.info("MongoDB connected successfully")
  } catch (error) {
    logger.error("MongoDB connection error:", error)
    throw new DatabaseError("Failed to connect to database")
  }
}

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal}, shutting down gracefully`)

  server.close(async () => {
    try {
      await mongoose.connection.close()
      logger.info("Database connection closed")
      process.exit(0)
    } catch (error) {
      logger.error("Error during shutdown:", error)
      process.exit(1)
    }
  })
}

// Start server
const PORT = Number.parseInt(process.env.PORT || "3005", 10)
const SERVICE_NAME = "application-service"
const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || "localhost"

let server: any

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase()

    server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Application service running on port ${PORT}`)
      logger.info(`Service address: ${SERVICE_ADDRESS}:${PORT}`)
    })

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason)
      gracefulShutdown("UNHANDLED_REJECTION")
    })

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      logger.error("Uncaught Exception:", error)
      gracefulShutdown("UNCAUGHT_EXCEPTION")
    })

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

export default app
