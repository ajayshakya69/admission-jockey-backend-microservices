import { Controller, Get } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

@ApiTags("Health Check")
@Controller()
export class HealthController {
  @Get("health")
  @ApiProperty({
    description: "Health check endpoint",
    type: Object,
    example: {
      status: "ok",
      timestamp: "2023-10-01T12:00:00Z",
      service: "auth-service",
    },
  })
  getHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "auth-service",
    };
  }
}
