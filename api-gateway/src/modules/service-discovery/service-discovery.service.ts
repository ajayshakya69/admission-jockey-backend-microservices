import { Injectable, Logger } from "@nestjs/common"
import axios from "axios"

interface ServiceInstance {
  address: string
  port: number
}

interface ConsulService {
  ServiceAddress: string
  Address: string
  ServicePort: number
}

@Injectable()
export class ServiceDiscoveryService {
  private readonly logger = new Logger(ServiceDiscoveryService.name)
  private readonly consulBaseUrl = process.env.CONSUL_URL || "http://service-discovery:8500/v1/catalog/service"

  async getServiceInstances(serviceName: string): Promise<ServiceInstance[]> {
    try {
      const response = await axios.get<ConsulService[]>(`${this.consulBaseUrl}/${serviceName}`)

      const instances = response.data.map((instance) => ({
        address: instance.ServiceAddress || instance.Address,
        port: instance.ServicePort,
      }))

      this.logger.debug(`🔍 Found ${instances.length} instances for ${serviceName}`)
      return instances
    } catch (error) {
      this.logger.error(`❌ Error fetching service instances from Consul:`, {
        serviceName,
        error: error.message,
      })
      return []
    }
  }

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
