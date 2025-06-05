import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthModule } from "./modules/auth/auth.module"
import { HealthModule } from "./modules/health/health.module"
import { ServiceDiscoveryModule } from "./modules/service-discovery/service-discovery.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI || "mongodb://localhost:27017/auth-service",
        connectionFactory: (connection) => {
          connection.on("connected", () => {
            console.log("✅ MongoDB connected successfully")
          })
          connection.on("error", (error) => {
            console.error("❌ MongoDB connection error:", error)
          })
          return connection
        },
      }),
    }),
    AuthModule,
    HealthModule,
    ServiceDiscoveryModule,
  ],
})
export class AppModule {}
