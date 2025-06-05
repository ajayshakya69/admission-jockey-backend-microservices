import "dotenv/config";
import app from  "./app";
import { serviceDiscovery } from "./services/serviceDiscovery.service";
import { logger } from "./utils/logger";
import { kafkaService } from "./services/kafka.service";

const PORT = parseInt(process.env.PORT || "3000", 10);
const SERVICE_NAME = "api-gateway";
const SERVICE_ID = `${SERVICE_NAME}-${PORT}`;
const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || "api-gateway";

const server = app.listen(PORT, "0.0.0.0", async () => {
  logger.info(`API Gateway running on port ${PORT}`);
  try {
    await kafkaService.connect();
    await serviceDiscovery.registerService(SERVICE_NAME, SERVICE_ID, SERVICE_ADDRESS, PORT);
  } catch (error) {
    logger.error("Failed to initialize services:", error);
  }
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  server.close(async () => {
    try {
      await serviceDiscovery.deregisterService(SERVICE_ID);
      logger.info("Server closed successfully");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
