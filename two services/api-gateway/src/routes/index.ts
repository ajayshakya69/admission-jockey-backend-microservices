import { Express, Request, Response } from "express";
import { proxyRequest } from "../proxy/proxy.request";
import messageQueueRoutes from "./messageQueue.routes";
import { authMiddleware } from "../middlewares/auth.middleware";

export default function registerRoutes(app: Express): void {
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "api-gateway",
    });
  });

  app.use("/message-queue", messageQueueRoutes);
  app.use("/auth", (req, res) => proxyRequest(req, res, "auth-service"));
  app.use("/users", authMiddleware, (req, res) => proxyRequest(req, res, "user-service"));
  app.use("/colleges", (req, res) => proxyRequest(req, res, "college-service"));
  app.use("/applications", authMiddleware, (req, res) => proxyRequest(req, res, "application-service"));
  app.use("/alumni", (req, res) => proxyRequest(req, res, "alumni-service"));
  app.use("/calendar", authMiddleware, (req, res) => proxyRequest(req, res, "calendar-service"));
  app.use("/payments", authMiddleware, (req, res) => proxyRequest(req, res, "payment-service"));
  app.use("/notifications", authMiddleware, (req, res) => proxyRequest(req, res, "notification-service"));

  // Global error and 404 handlers
  app.use("*", (req, res) => {
    res.status(404).json({
      message: "Route not found",
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  });
}
