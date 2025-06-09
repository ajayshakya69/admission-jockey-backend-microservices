import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { ServiceDiscoveryService } from "./modules/service-discovery/service-discovery.service";
import { KafkaService } from "./modules/message-queue/kafka/kafka.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import   bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser:false
  });
  const logger = new Logger("Bootstrap");

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }));

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS
  app.enableCors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://myapp.com", "https://admin.myapp.com"]
        : "*",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .addBearerAuth() // Optional, for auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-gateway/api/docs", app, document);

  const PORT = Number.parseInt(process.env.PORT || "3000", 10);
  const SERVICE_NAME = "api-gateway";
  const SERVICE_ID = `${SERVICE_NAME}-${PORT}`;
  const SERVICE_ADDRESS = process.env.SERVICE_ADDRESS || "api-gateway";

  await app.listen(PORT, "0.0.0.0");

  logger.log(`🚀 API Gateway running on port ${PORT}`, "Bootstrap");

  // Initialize services
  try {
    const kafkaService = app.get(KafkaService);
    const serviceDiscovery = app.get(ServiceDiscoveryService);

    await kafkaService.connect();
    await serviceDiscovery.registerService(
      SERVICE_NAME,
      SERVICE_ID,
      SERVICE_ADDRESS,
      PORT
    );

    logger.log("✅ Services initialized successfully", "Bootstrap");
  } catch (error) {
    logger.error("❌ Failed to initialize services:", error, "Bootstrap");
  }

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.warn(`📡 Received ${signal}, shutting down gracefully`, "Bootstrap");

    try {
      const serviceDiscovery = app.get(ServiceDiscoveryService);
      await serviceDiscovery.deregisterService(SERVICE_ID);
      await app.close();
      logger.log("✅ Server closed successfully", "Bootstrap");
      process.exit(0);
    } catch (error) {
      logger.error("❌ Error during shutdown:", error, "Bootstrap");
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

bootstrap();
