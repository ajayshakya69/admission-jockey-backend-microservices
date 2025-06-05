import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import { logger } from "./utils/logger";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGINS?.split(",") || []
        : "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
});

// Health check endpoint
app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "auth-service",
  });
});

// Routes
app.use("/auth", authRoutes);

// Global error handler
app.use(
  (error: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error("Unhandled error:", {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
    });

    res.status(500).json({
      message: "Internal server error",
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
);

// 404 handler
app.use("*", (req: Request, res: Response): void => {
  res.status(404).json({
    message: "Route not found",
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
});

// Database connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};


// Service registration with Consul
const registerWithConsul = async (): Promise<void> => {
  const SERVICE_NAME = "auth-service";
  const SERVICE_ID = `${SERVICE_NAME}-${PORT}`;
  const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || "auth-service";

  try {
    await axios.put("http://service-discovery:8500/v1/agent/service/register", {
      ID: SERVICE_ID,
      Name: SERVICE_NAME,
      Address: SERVICE_ADDRESS,
      Port: PORT,
      Check: {
        HTTP: `http://${SERVICE_ADDRESS}:${PORT}/health`,
        Interval: "10s",
        DeregisterCriticalServiceAfter: "1m",
      },
    });
    logger.info("Service registered with Consul", { serviceId: SERVICE_ID });
  } catch (error) {
    logger.error("Failed to register with Consul:", error);
  }
};

// Start server
const PORT = Number.parseInt(process.env.PORT || "3001", 10);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Auth service running on port ${PORT}`);
      registerWithConsul();
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);

      server.close(async () => {
        try {
          await mongoose.connection.close();
          logger.info("Database connection closed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
