import { Injectable, Logger } from "@nestjs/common"
import axios from "axios"


@Injectable()
export class ServiceDiscoveryService {
  private readonly logger = new Logger(ServiceDiscoveryService.name)

  async registerService(serviceName: string, serviceId: string, address: string, port: number): Promise<void> {
    try {
      await axios.put("http://service-discovery:8500/v1/agent/service/register", {
        ID: serviceId,
        Name: serviceName,
        Address: address,
        Port: port,
        Check: {
          HTTP: `http://${address}:${port}/health`,
          Interval: "10s",
          DeregisterCriticalServiceAfter: "1m",
        },
      })
      this.logger.log(`✅ Service registered with Consul: ${serviceName} (${serviceId})`)
    } catch (error) {
      this.logger.error(`❌ Failed to register service with Consul:`, {
        serviceName,
        serviceId,
        error: error.message,
      })
    }
  }

  async deregisterService(serviceId: string): Promise<void> {
    try {
      await axios.put(`http://service-discovery:8500/v1/agent/service/deregister/${serviceId}`)
      this.logger.log(`✅ Service deregistered from Consul: ${serviceId}`)
    } catch (error) {
      this.logger.error(`❌ Failed to deregister service from Consul:`, {
        serviceId,
        error: error.message,
      })
    }
  }
}
