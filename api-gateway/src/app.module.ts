import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ThrottlerModule } from "@nestjs/throttler"
import { HealthModule } from "./modules/health/health.module"
import { ProxyModule } from "./modules/proxy/proxy.module"
import { MessageQueueModule } from "./modules/message-queue/message-queue.module"
import { ServiceDiscoveryModule } from "./modules/service-discovery/service-discovery.module"
import { KafkaModule } from "./modules/message-queue/kafka/kafka.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: process.env.NODE_ENV === "production" ? 100 : 1000,
      },
    ]),
    HealthModule,
    ProxyModule,
    MessageQueueModule,
    ServiceDiscoveryModule,
    KafkaModule,
  ],
})
export class AppModule {}
